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
} from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { TeacherAPI } from "../../../apis/censor/teacher/teacher.api";
import { GetUser, SetUser } from "../../../app/reducers/users/users.reducer";
import { Link } from "react-router-dom";
import "./index.css";

export default function Teacher() {
  const dispatch = useAppDispatch();
  // const [current, setCurrent] = useState(1);
  // const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = () => {
    const data = {
      title: title,
    };
    TeacherAPI.fetchAll(data).then((response) => {
      dispatch(SetUser(response.data.data));
      // setTotal(response.data.data.totalPages);
    });
  };

  const data = useAppSelector(GetUser);
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: () => <div>Action</div>,
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết giảng viên">
            <Link to={`/censor/teacher/${record.key}`}>
              <Button className="update-button" onClick={() => {}}>
                <EyeOutlined className="icon" />
              </Button>
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Chọn hàng lẻ",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Chọn hàng chẵn",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  const handleAddTeachersToPeriod = () => {
    if (selectedRowKeys.length === 0) {
      message.error("Vui lòng chọn giảng viên");
    } else {
      // Thực hiện hành động khi selectedRowKeys.length > 0
      const selectedTeachers = data.filter((item) =>
        selectedRowKeys.includes(item.key)
      );
      dispatch(SetUser(selectedTeachers));
    }
  };

  return (
    <>
      <Card className="mb-2">
        <Row>
          <Col span={8} className="mr-2">
            <h1>Tiêu đề form</h1>
            <Input
              placeholder="Tìm kiếm theo tiêu đề form"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </Col>
          <Col span={10}></Col>
        </Row>
      </Card>

      <Card>
        <div>
          <div className="flex flex-row-reverse">
            <div>
              <span>
                <Tooltip title="Thêm giảng viên vào đợt">
                  <Link to="/censor/teacher/registration">
                    <Button
                      className={`add-button1 ${
                        selectedRowKeys.length === 0 ? "disabled" : ""
                      }`}
                      onClick={handleAddTeachersToPeriod}
                      disabled={selectedRowKeys.length === 0}
                    >
                      <PlusOutlined className="mr-1" />
                      Thêm giảng viên vào đợt
                    </Button>
                  </Link>
                </Tooltip>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div>
        {/* <div className="mt-5 text-center">
          <Pagination
            simple
            current={current}
            onChange={(value) => {
              setCurrent(value);
            }}
            total={total * 10}
          />
        </div> */}
      </Card>
    </>
  );
}
