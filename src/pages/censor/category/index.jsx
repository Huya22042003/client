/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Button,
  Pagination,
  Space,
  Table,
  Card,
  Input,
  Tooltip,
  Form,
  Row,
  Col,
} from "antd";
import { PlusOutlined, EditOutlined, FormOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { CategoryAPI } from "../../../apis/censor/category/category.api";
import {
  GetCategory,
  SetCategory,
} from "../../../app/reducers/category/category.reducer";
import ModalThem from "./ModalAdd";
import ModalDetail from "./ModalDetail";
import "./index.css";

export default function Index() {
  const [showModal, setShowModal] = useState(false);
  const [detailCategory, setDetailCategory] = useState();
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  useEffect(() => {
    CategoryAPI.fetchAll().then((response) => {
      dispatch(SetCategory(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [current]);

  const fetchData = () => {
    CategoryAPI.fetchAll({
      search: search,
      page: current - 1,
    }).then((response) => {
      dispatch(SetCategory(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
  };

  const data = useAppSelector(GetCategory);

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
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Tên thể loại",
      dataIndex: "name",
      key: "name",
    },
    {
      title: () => <div>Action</div>,
      key: "action",
      render: (_, record) => (
        <Space size="small">
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
          <ModalDetail category={record} icon={<FormOutlined />} />
        </Space>
      ),
    },
  ];
  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setCurrent(1);
      fetchData();
    }
  };
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
        <Form className="-mt-1">
          <h1 className="text-xl -mt-2">Tìm kiếm thể loại bài viết</h1>
          <Row>
            <Col xs={21}>
              <div className="relative w-full mr-6">
                <Input
                  onKeyDown={handleEnterKey}
                  style={{ borderRadius: "30px" }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm tên hoặc mã..."
                />
              </div>
            </Col>
            <Col xs={3} style={{ paddingLeft: "20px" }}>
              <Button
                className="searchButton"
                onClick={() => {
                  setCurrent(1);
                  fetchData();
                }}
              >
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <div>
          <div className="flex flex-row-reverse">
            <div>
              <span>
                <Tooltip title="Thêm thể loại">
                  <button
                    className="add-button1"
                    onClick={() => {
                      setShowModal(true);
                      setDetailCategory(null);
                    }}
                  >
                    <PlusOutlined className="mr-1" />
                    Thêm thể loại
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
            rowKey="id"
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
