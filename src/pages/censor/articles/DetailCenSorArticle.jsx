import React from "react";
import anh1 from "../../../assets/images/face-1.jpg";
import {
  Avatar,
  Button,
  Col,
  Row,
  Space,
  Modal,
  Typography,
  Select,
  Tooltip,
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
const DetaiConsorArticle = () => {
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
        const response = await CensorAPI.detail(id);
        setDetailArticle(response.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchDetailArticles();
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
      const response2 = CensorAPI.approveArticle(dataApproval).then(
        (result) => {
          dispatch(UpdateArticles(result.data.data));
          stompClient.send("/action/create-notification-user/" + idUser);
          setModal1Open(false);
          navigate("/censor/article");
          message.success("Phê duyệt thành công!");
        }
      );
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
      const response2 = CensorAPI.refuseArticle(dataRefuse).then((result) => {
        dispatch(UpdateArticles(result.data.data));
        stompClient.send("/action/create-notification-user/" + idUser);
        setModal2Open(false);
        message.success("Bài viết đã bị từ chối!");
        navigate("/censor/article");
      });
    } catch (error) {
      console.error("Error refusing articles:", error);
      message.error("Có lỗi xảy ra khi từ chối bài viết.");
    }
  };

  const handleSaveCategory = (newCategory) => {
    setListCategory([newCategory, ...listCategory]);
  };
  return (
    <>
      <div className="justify-items-center bg-white -mt-2 rounded-md">
        {/* open model */}
        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Button
            className="buttonapprove"
            style={{ marginRight: "20px" }}
            onClick={() => setModal1Open(true)}
          >
            Phê duyệt
          </Button>
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
                isSendArticle={true}
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
          <Button
            type="default"
            className="reject"
            onClick={() => setModal2Open(true)}
          >
            Từ chối
          </Button>
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
        {/* <div>
        <div
          className="pt-16 "
          style={{
            borderBottom: "1px solid rgba(242, 242, 242, 1)",
          }}
        >
          <div>
            <a href="# ">
              <Avatar src={anh1} style={{ width: "72px", height: "72px" }} />
            </a>
          </div>
          <div className="flex -mt-3 mb-3 justify-between">
            <div>
              <h3 className="text-2xl font-medium mb-3">
                <a href="# " className="text-black">
                  Written by {detailArticle.name}
                </a>
              </h3>
              <a href="# ">206K Followers</a>
              <p>
                Chào các bạn mình là Hải cute, cảm ơn các bạn đã ủng hộ bài viết
                của mình.
              </p>
            </div>
            <div className="mt-6 ">
              <Button
                className="rounded-3xl border-black bg-black px-4 py-2 text-white h-9 w-16 leading-2"
                style={{
                  borderRadius: "30px",
                }}
              >
                Follow
              </Button>
              <Button
                className=" border-2 border-black bg-black  text-sm  ml-2"
                style={{
                  borderRadius: "99em",
                  padding: "4px 9px",
                  color: " rgba(255, 255, 255, 1)",
                  lineHeight: "10px",
                }}
              >
                <MailOutlined className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default DetaiConsorArticle;
