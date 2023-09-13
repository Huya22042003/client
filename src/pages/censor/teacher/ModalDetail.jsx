import { useParams } from "react-router-dom";
import {
  Form,
  Input,
  Row,
  Col,
  Space,
  Table,
  Card,
  Tooltip,
  Pagination,
} from "antd";
import { useState, useEffect } from "react";
import { TeacherAPI } from "../../../apis/censor/teacher/teacher.api";
import { PlusOutlined } from "@ant-design/icons";
import ModalExcelmportFileTeacher from "./ModalExcelmportFileTeacher";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  GetRegistrationUser,
  SetRegistrationUser,
} from "../../../app/reducers/registration-user/registration-user.reducer";
import moment from "moment";
const DetailTeacher = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [detailTeacher, setDetailTeacher] = useState(null);
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [check, setCheck] = useState(false);
  const [key, setKey] = useState(1);

  useEffect(() => {
    TeacherAPI.detail({}, id).then((response) => {
      setDetailTeacher(response.data.data);
    });
  }, []);

  useEffect(() => {
    TeacherAPI.page().then((response) => {
      dispatch(SetRegistrationUser(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCheck(true);
    });
  }, [dispatch]);

  const data = useAppSelector(GetRegistrationUser);

  useEffect(() => {
    fetchData();
  }, [current]);

  const fetchData = () => {
    const data = {
      idUser: id,
      page: current - 1,
    };
    TeacherAPI.page(data).then((response) => {
      dispatch(SetRegistrationUser(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCheck(true);
    });
  };

  // Start excel
  const [showModalExcel, setShowModalExcel] = useState(false);
  const handleOpenModalExcel = () => {
    setShowModalExcel(true);
  };
  // End excel

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "cdoe",
    },
    {
      title: "Tên đợt đăng ký",
      dataIndex: "nameRegistrationPeriod",
      key: "nameRegistrationPeriod",
    },
    {
      title: "Số lượng bài viết",
      dataIndex: "numberArticles",
      key: "numberArticles",
      align: "center",
    },
    {
      title: "Thời gian ",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (record) => {
        const fromDate = moment(record.fromDate).format("DD/MM/YYYY");
        const toDate = moment(record.toDate).format("DD/MM/YYYY");
        return `${fromDate} - ${toDate}`;
      },
    },
    {
      title: "Trạng thái",
      key: "reminderStatus",
      dataIndex: "reminderStatus",
      render: (_, record) => {
        return record.reminderStatus === 0 ? "Hoạt động" : "Không hoạt động";
      },
    },
  ];

  return (
    <>
      <Card>
        <Form
          layout="vertical"
          style={{
            maxWidth: 1400,
          }}
        >
          <Form.Item label="Thông tin giảng viên">
            {detailTeacher ? (
              // Hiển thị dữ liệu nếu detailTeacher có giá trị
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Mã giảng viên">
                      <Input value={detailTeacher.code} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Họ tên">
                      <Input value={detailTeacher.name} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Số điện thoại">
                      <Input value={detailTeacher.phoneNumber} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Email">
                      <Input value={detailTeacher.email} />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : (
              // Hiển thị thông báo nếu detailTeacher là null
              <div>Không có dữ liệu.</div>
            )}
          </Form.Item>
        </Form>
      </Card>
      <Card style={{ marginTop: "30px" }}>
        <div>
          <div className="flex flex-row-reverse">
            <div>
              <span className=" mr-5">
                <Tooltip title="Import giảng viên vào đợt">
                  <button
                    onClick={handleOpenModalExcel}
                    style={{
                      color: "#fff",
                      borderRadius: "5px",
                    }}
                    className="download-button bg-green-500 hover:bg-green-400  hover:border-green-400 mx-5"
                  >
                    <PlusOutlined className="mr-1" />
                    Import giảng viên vào đợt
                  </button>
                </Tooltip>
              </span>
            </div>
            <ModalExcelmportFileTeacher
              visible={showModalExcel}
              onClose={() => setShowModalExcel(false)}
              id={id}
              fetchData={() => fetchData()}
            />
          </div>
        </div>
        <div className="mt-5">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            key={key}
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
};
export default DetailTeacher;
