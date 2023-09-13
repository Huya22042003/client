import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Pagination,
  Space,
  Table,
  Card,
  Tooltip,
  DatePicker,
  Row,
  Col,
  Input,
  Select,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import {
  GetArticles,
  SetArticles,
} from "../../../app/reducers/articles/articles.reducer";
import "./index.css";
import { CensorAPI } from "../../../apis/censor/article/article.api";

export default function ApprovedHistory() {
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { Option } = Select;
  const [status, setStatus] = useState([]);

  useEffect(() => {
    fetchData();
  }, [current]);

  const fetchData = () => {
    CensorAPI.getAllHistoryArticle({
      title: title,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      page: current - 1,
      statusList: status,
    }).then((response) => {
      dispatch(SetArticles(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCurrent(response.data.data.currentPage + 1);
    });
  };

  const handleSearchButtonClick = () => {
    setCurrent(1);
    fetchData();
  };

  const data = useAppSelector(GetArticles);
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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
      render: (text) => {
        if (text.length > 40) {
          return <span>{text.slice(0, 40)}...</span>;
        }
        return <span>{text}</span>;
      },
    },
    {
      title: "Tác giả",
      dataIndex: "name",
      key: "title",
    },
    {
      title: "Thể loại",
      dataIndex: "nameCategory",
      key: "nameCategory",
      render: (nameCategory) => {
        return nameCategory ? nameCategory : "Không có";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (createdDate) => formatDate(createdDate),
    },
    {
      title: "Ngày thao tác",
      dataIndex: "browseDate",
      key: "browseDate",
      render: (createdDate) => formatDate(createdDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "3"
          ? "Đã phê duyệt"
          : status === "4"
          ? "Đã hủy"
          : "Gửi lại, chờ phê duyệt",
    },
    {
      title: () => <div>Action</div>,
      key: "action",
      render: (record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Link to={`/censor/approved-history/${record.id}`}>
              {<EyeOutlined />}
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Card className="mb-2">
        <Row className="-mt-5 justify-between">
          <Col span={8} className="mr-2">
            <h1>Tiêu đề bài viết</h1>
            <Input
              placeholder="Tìm kiếm theo tiêu đề bài viết"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </Col>
          <Col span={5} className="mr-2">
            <h1>Trạng thái</h1>
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: "100%" }}
              onChange={(value) => {
                setStatus(value); // Cập nhật giá trị trạng thái
              }}
              value={status}
              size="large"
            >
              <Option value="">Không có gì</Option>
              <Option value="4">Đã từ chối</Option>
              <Option value="3">Đã phê duyệt</Option>
              <Option value="7">Gửi lại chờ phê duyệt</Option>
            </Select>
          </Col>
          <Col span={10}>
            <h1>Ngày thao tác</h1>
            <div className="flex">
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
