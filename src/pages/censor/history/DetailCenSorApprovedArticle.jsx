import React from "react";
import anh1 from "../../../assets/images/face-1.jpg";
import {
  Avatar,
  Input,
  Button,
  Col,
  Row,
  Space,
  Modal,
  Typography,
  Select,
  Tooltip,
  Tag,
  Table,
  Card,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import JoditEditor from "jodit-react";
import { CensorAPI } from "../../../apis/censor/article/article.api";
import { useParams, useNavigate } from "react-router-dom";
import { CategoryAPI } from "../../../apis/censor/category/category.api";
import ModalThem from "../category/ModalAdd";
import { UpdateArticles } from "../../../app/reducers/articles/articles.reducer";
import { useAppDispatch } from "../../../app/hooks";
import { message } from "antd";

import {
  connectStompClient,
  getStompClient,
} from "../../../apis/stomp-client/config";
import { SetCountNotification } from "../../../app/reducers/notification/count-notification.reducer";
import { idUser } from "../../../AppConfig";
import TextArea from "antd/es/input/TextArea";
import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import { FaRegCalendarCheck } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import { GiReturnArrow } from "react-icons/gi";
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import { CensorHistoryAPI } from "../../../apis/censor/history/history-user.api";
// import "./timeline.css";

const DetaiConsorApprovedArticle = () => {
  const navigate = useNavigate();
  const [detailArticle, setDetailArticle] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [modal1Open, setModal1Open] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [approvalText, setApprovalText] = useState("");
  const [refuseText, setRefuseText] = useState("");
  const [modal2Open, setModal2Open] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detailCategory, setDetailCategory] = useState();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isApprovalTextValid, setIsApprovalTextValid] = useState(false);
  const [isRefuseTextValid, setIsRefuseTextValid] = useState(false);
  const [dataTimeline, setDataTimeline] = useState();
  const [isModalOpenHistory, setModalOpenHistory] = useState(false);

  useEffect(() => {
    connectStompClient();
  }, []);
  useEffect(() => {
    const fetchListCategory = async () => {
      try {
        const response1 = await CategoryAPI.fetchAllCategory();
        setListCategory(response1.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchListCategory();
  }, []);
  useEffect(() => {
    const fetchDetailArticles = async () => {
      try {
        const response = await CensorAPI.detailApprovedArticle(id);
        setDetailArticle(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchDetailArticles();
  }, []);
  useEffect(() => {
    const fetchTimelineArticleHistory = async () => {
      try {
        const data = {
          articleId: id,
        };
        await CensorHistoryAPI.findTimelineArticleHistory(data).then(
          (response) => {
            setDataTimeline(response.data.data);
          }
        );
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchTimelineArticleHistory();
  }, []);
  const stompClient = getStompClient();
  const connect = () => {
    stompClient.connect({}, () => {
      stompClient.subscribe(
        "/portal-articles/create-notification-user/" + idUser,
        function (message) {
          const data = JSON.parse(message.body).data;
          dispatch(SetCountNotification(data));
        }
      );
    });
  };
  useEffect(() => {
    if (stompClient != null && id != null) {
      connect();
    }

    return () => {
      if (stompClient != null && id != null) {
        getStompClient().disconnect();
      }
    };
  }, [stompClient, id]);

  const onChangeTextApproval = (e) => {
    setApprovalText(e.target.value);
    setIsApprovalTextValid(e.target.value.trim().length >= 6);
  };

  const onChangeTextRefuse = (e) => {
    setRefuseText(e.target.value);
    setIsRefuseTextValid(e.target.value.trim() !== "");
  };

  const onChangeSelect = (value) => {
    setSelectedCategory(value);
    setIsCategorySelected(value !== null);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const handleApproval = () => {
    if (!isCategorySelected) {
      message.error("Vui lòng chọn thể loại trước khi phê duyệt.");
      return;
    }

    if (!isApprovalTextValid) {
      message.error("Nhận xét phải có ít nhất 6 kí tự");
      return;
    }

    const dataApproval = {
      id: id,
      categoryId: selectedCategory,
      feedback: approvalText,
    };

    try {
      CensorAPI.approveArticle(dataApproval).then((result) => {
        dispatch(UpdateArticles(result.data.data));
        stompClient.send("/action/create-notification-user/" + idUser);
        setModal1Open(false);
        navigate("/censor/approved-history");
        message.success("Phê duyệt thành công!");
      });
    } catch (error) {
      console.error("Error approval articles:", error);
      message.error("Có lỗi xảy ra khi phê duyệt.");
    }
  };
  const handleRefuse = () => {
    if (!isRefuseTextValid) {
      message.error("Vui lòng nhập nhận xét trước khi từ chối bài viết.");
      return;
    }

    const dataRefuse = {
      id: id,
      feedback: refuseText,
    };

    try {
      CensorAPI.refuseArticle(dataRefuse).then((result) => {
        dispatch(UpdateArticles(result.data.data));
        stompClient.send("/action/create-notification-user/" + idUser);
        setModal2Open(false);
        message.success("Bài viết đã bị từ chối!");
        navigate("/censor/approved-history");
      });
    } catch (error) {
      console.error("Error refusing articles:", error);
      message.error("Có lỗi xảy ra khi từ chối bài viết.");
    }
  };

  const handleSaveCategory = (newCategory) => {
    setListCategory([...listCategory, newCategory]);
  };

  const showIcon = (status) => {
    if (status === "2") {
      return BiLoader;
    } else if (status === "3") {
      return FaRegCalendarCheck;
    } else if (status === "7") {
      return GiReturnArrow;
    } else {
      return BsFileEarmarkExcelFill;
    }
  };

  const openModalHistory = () => {
    setModalOpenHistory(true);
  };

  const closeModalHistory = () => {
    setModalOpenHistory(false);
  };

  const columns = [
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let icon;
        let title;
        switch (status) {
          case "2":
            icon = <BiLoader />;
            title = "Chờ phê duyệt";
            break;
          case "3":
            icon = <FaRegCalendarCheck />;
            title = "Đã phê duyệt";
            break;
          case "4":
            icon = <BsFileEarmarkExcelFill />;
            title = "Đã bị từ chối";
            break;
          case "5":
            icon = <BsFileEarmarkExcelFill />;
            title = "Đã xóa";
            break;
          case "7":
            icon = <GiReturnArrow />;
            title = "Đã gửi lại chờ phê duyệt";
            break;
          default:
            icon = <BsFileEarmarkExcelFill />;
            title = "Đã gửi đào tạo";
            break;
        }
        return (
          <span>
            {icon} {title}
          </span>
        );
      },
      style: { background: "#FFFFFF" },
    },
    {
      title: "Thời gian",
      dataIndex: "createAt",
      key: "createAt",
      style: { background: "#FFFFFF" },
      render: (createAt) =>
        createAt ? moment(createAt).format("HH:mm:ss DD-MM-YYYY") : "Không có", // Định dạng thời gian và hiển thị "Không có" nếu không có dữ liệu
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      style: { background: "#FFFFFF" },
      render: (note) => (note ? note : "Không có"), // Hiển thị "Không có" nếu không có dữ liệu
    },
  ];

  return (
    <>
      <Card className="justify-items-center bg-white -mt-2 mb-4 rounded-md">
        <div>
          {dataTimeline ? (
            <Timeline minEvents={1} placeholder className="test">
              {dataTimeline.map((item, index) => (
                <TimelineEvent
                  color={item.status != "4" ? "#0099FF" : "#FF0000"}
                  icon={showIcon(item.status)}
                  title={
                    item.status === "2"
                      ? "Chờ phê duyệt"
                      : item.status === "3"
                      ? "Đã phê duyệt"
                      : item.status === "4"
                      ? "Đã bị từ chối"
                      : item.status === "5"
                      ? "Đã xóa"
                      : item.status === "7"
                      ? "Đã gửi lại chờ phê duyệt"
                      : "Đã gửi đào tạo"
                  }
                  subtitle={moment(item.createAt).format(
                    " HH:mm:ss DD-MM-YYYY "
                  )}
                />
              ))}
            </Timeline>
          ) : (
            <p>Không có dữ liệu để hiển thị.</p>
          )}
        </div>
        <div className="text-center">
          {/* <div style={{ }}> */}
          <Button
            className="add-button"
            style={{ marginTop: -40, float: "right" }}
            onClick={openModalHistory}
          >
            Lịch sử
          </Button>
          {/* </div> */}
          <Modal
            visible={isModalOpenHistory}
            onCancel={closeModalHistory}
            width={800}
            style={{ background: "none" }} // Đặt màu nền của modal thành trong suốt
            footer={null}
          >
            <h2>Lịch sử</h2>
            <Table
              columns={columns}
              dataSource={dataTimeline}
              pagination={false} // Tắt phân trang nếu không muốn nút "Đóng" trong footer
              style={{ background: "none" }} // Đặt màu nền của bảng thành trong suốt
            />
          </Modal>
        </div>
      </Card>
      <div className="justify-items-center bg-white -mt-2 rounded-md">
        {/* open model */}
        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {(detailArticle.status === 4 || detailArticle.status === 7) && (
            <Button
              className="buttonapprove"
              style={{ marginRight: "20px" }}
              onClick={() => setModal1Open(true)}
            >
              Phê duyệt
            </Button>
          )}

          <Modal
            title={
              <h1 style={{ fontSize: "20px", marginBottom: "30px" }}>
                Phê duyệt bài viết
              </h1>
            }
            style={{
              top: 20,
            }}
            open={modal1Open}
            onOk={handleApproval}
            onCancel={() => setModal1Open(false)}
          >
            {showModal && (
              <ModalThem
                modalOpen={showModal}
                setModalOpen={setShowModal}
                category={detailCategory}
                SetCategory={setDetailCategory}
                onSave={handleSaveCategory}
              />
            )}

            {/* select category */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "25px",
                marginTop: "15px",
              }}
            >
              <Select
                style={{ width: "100%" }}
                showSearch
                size="large"
                placeholder="Thể loại"
                optionFilterProp="children"
                onChange={onChangeSelect}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={listCategory.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />
              <div style={{ marginLeft: "5px" }}>
                <div className="flex flex-row-reverse">
                  <div>
                    <span>
                      <Tooltip title="Thêm thể loại">
                        <button
                          style={{ height: "40px" }}
                          className="add-button"
                          onClick={() => {
                            setShowModal(true);
                            setDetailCategory(null);
                          }}
                        >
                          <PlusOutlined className="mr-1" />
                        </button>
                      </Tooltip>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* input text phê duyệt */}
            <TextArea
              autoSize={{ minRows: 5, maxRows: 20 }}
              style={{
                height: 120,
                marginBottom: 24,
              }}
              onChange={onChangeTextApproval}
              placeholder="Nhập lời nhận xét của bạn ở đây..."
            />
          </Modal>
          {detailArticle.status === 3 && (
            <Button
              type="default"
              className="reject"
              onClick={() => setModal2Open(true)}
            >
              Từ chối
            </Button>
          )}
          <Modal
            title={
              <h1 style={{ fontSize: "20px", marginBottom: "20px" }}>
                Từ chối bài viết
              </h1>
            }
            style={{
              top: 20,
            }}
            open={modal2Open}
            onOk={handleRefuse}
            onCancel={() => setModal2Open(false)}
          >
            <TextArea
              autoSize={{ minRows: 5, maxRows: 20 }}
              style={{
                height: 120,
                marginBottom: 24,
              }}
              onChange={onChangeTextRefuse}
              placeholder="Nhập lời nhận xét của bạn ở đây..."
            />
          </Modal>
          {/* detail bài viết */}
          <Row>
            <Col span={24}>
              <h1 className="text-5xl text-slate-900 font-bold not-italic mb-8">
                {detailArticle.title}
              </h1>
              <div className="flex">
                <Avatar src={anh1} style={{ width: "50px", height: "50px" }} />

                <div className="ml-3">
                  <div className="flex">
                    <Typography variant="subtitle1" className="name1">
                      {detailArticle.name}
                    </Typography>
                  </div>
                  <span>
                    {moment(detailArticle.createdDate).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
              <div>
                <JoditEditor
                  value={detailArticle.content}
                  tabIndex={-1}
                  className="bg-transparent"
                  config={{
                    readonly: true,
                    toolbar: false,
                    showCharsCounter: false,
                    showWordsCounter: false,
                    showStatusbar: true,
                    showPoweredBy: false,
                  }}
                />
              </div>
              <Row>
                <div className=" float-left pt-5 pb-10">
                  <Space size={[0, 8]} wrap>
                    {/* {detailArticle.hashtags.split(", ").map((el) => (
                  <Tag bordered={false} className="rounded-lg">
                    <Link href={`/articel?hashtag=`}>{el}</Link>
                  </Tag>
                ))} */}
                  </Space>
                </div>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default DetaiConsorApprovedArticle;
