import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Button,
  Pagination,
  Space,
  Table,
  Card,
  Input,
  Tooltip,
  Row,
  Col,
  message,
  Modal,
  DatePicker,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PushpinOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { FormSendAPI } from "../../../apis/censor/form-send/form-send.api";
import {
  GetFormSend,
  SetFormSend,
} from "../../../app/reducers/form-send/form-send.reducer";
import ModalThem from "./ModalAdd";
import "./index.css";

export default function FormSend() {
  const [showModal, setShowModal] = useState(false);
  const [detailCategory, setDetailCategory] = useState();
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const fetchData = () => {
    const data = {
      title: title,
      fromDate: new Date(startDate).getTime(),
      toDate: new Date(endDate).getTime(),
      page: current - 1,
    };
    FormSendAPI.fetchAll(data).then((response) => {
      dispatch(SetFormSend(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        FormSendAPI.delete(id)
          .then(() => {
            message.success("Xóa thành công!");
            fetchData();
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              message.error(error.response.data.message);
            } else {
              message.error("Lỗi.");
            }
          });
      },
    });
  };
  const handleSetDefault = (id) => {
    Modal.confirm({
      title: "Xác nhận ghim",
      content: "Bạn có chắc chắn muốn ghim không?",
      okText: "Ghim",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        FormSendAPI.setDefault(id)
          .then(() => {
            message.success("Ghim thành công!");
            fetchData();
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              message.error(error.response.data.message);
            } else {
              message.error("Lỗi.");
            }
          });
      },
    });
  };

  const handleUnSetDefault = (id) => {
    Modal.confirm({
      title: "Xác nhận hủy ghim",
      content: "Bạn có chắc chắn muốn hủy ghim không?",
      okText: "Hủy hhim",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        FormSendAPI.unSetDefault(id)
          .then(() => {
            message.success("Hủy ghim thành công!");
            fetchData();
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              message.error(error.response.data.message);
            } else {
              message.error("Lỗi.");
            }
          });
      },
    });
  };

  const data = useAppSelector(GetFormSend);
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSearchButtonClick = () => {
    setCurrent(1);
    fetchData();
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
      render: (text, record) => {
        const isRed = record.defaulted === true; // Kiểm tra trạng thái status
        const shortenedText =
          text.length > 50 ? text.substring(0, 50) + "..." : text;
        return (
          <span style={{ color: isRed ? "red" : "inherit" }}>
            {shortenedText}
          </span>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (createdDate) => formatDate(createdDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive === "1" || isActive === "ACTIVE"
          ? "Hoạt động"
          : "Không hoạt động",
    },
    {
      title: () => <div>Action</div>,
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={record.defaulted ? "Hủy mặc định" : "Set mặc định"}>
            <Button
              className="update-button"
              onClick={() =>
                record.defaulted
                  ? handleUnSetDefault(record.key)
                  : handleSetDefault(record.key)
              }
              type="primary"
              danger
            >
              {record.defaulted ? (
                <CloseOutlined className="icon" />
              ) : (
                <PushpinOutlined className="icon" />
              )}
            </Button>
          </Tooltip>
          <Tooltip title="Cập nhập">
            <Button
              className="update-button"
              onClick={() => {
                setDetailCategory(record);
                setShowModal(true);
              }}
            >
              <EditOutlined className="icon" />
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              className="button"
              onClick={() => handleDelete(record.key)}
              type="primary"
              danger
            >
              <DeleteOutlined className="icon" />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <>
      {showModal && (
        <ModalThem
          modalOpen={showModal}
          setModalOpen={setShowModal}
          category={detailCategory}
          SetCategory={setDetailCategory}
        />
      )}

      <Card className="mb-2">
        <Row className="flex justify-between -mt-5">
          <Col span={10} className="mr-2">
            <h1>Tiêu đề form</h1>
            <Input
              placeholder="Tìm kiếm theo tiêu đề form"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </Col>
          <Col span={13}>
            <h1>Ngày tạo</h1>
            <div className="flex justify-between">
              <DatePicker
                value={startDate}
                onChange={(el) => setStartDate(el)}
                locale={locale}
                className="datePicker"
                placeholder="Ngày bắt đầu"
              />
              <DatePicker
                value={endDate}
                onChange={(el) => setEndDate(el)}
                locale={locale}
                className="datePicker"
                placeholder="Ngày kết thúc"
              />
              <Button
                type="primary"
                className="search-button"
                onClick={handleSearchButtonClick}
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      <Card>
        <div>
          <div className="flex flex-row-reverse">
            <div>
              <span>
                <Tooltip title="Thêm form">
                  <button
                    className="add-button1"
                    onClick={() => {
                      setShowModal(true);
                      setDetailCategory(null);
                    }}
                  >
                    <PlusOutlined className="mr-1" />
                    Thêm form
                  </button>
                </Tooltip>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="key"
            pagination={false}
          />
        </div>
        <div className="mt-5 text-center">
          <Pagination
            simple
            current={current}
            onChange={(value) => {
              setCurrent(value);
            }}
            total={total * 10}
          />
        </div>
      </Card>
    </>
  );
}
