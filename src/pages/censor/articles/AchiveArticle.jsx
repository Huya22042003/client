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
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import locale from "antd/es/date-picker/locale/vi_VN";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import "./index.css";
import { CensorAPI } from "../../../apis/censor/article/article.api";

const AchiveArticle = () => {
  const [current, setCurrent] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [archive, setArchive] = useState([]);
  const [currentAchive, setCurrentArchive] = useState(1);
  const [totalAchive, setTotalAchive] = useState(0);

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    fetchArchiveData();
  }, [currentAchive]);

  const fetchArchiveData = () => {
    CensorAPI.fetchAllApprovedArticle({
      search: search,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      page: current - 1,
    }).then((response) => {
      setArchive(response.data.data.data);
      setTotalAchive(response.data.data.totalPages);
      setCurrentArchive(response.data.data.currentPage + 1);
    });
    const queryParams = new URLSearchParams(location.search);
    if (search != "") queryParams.set("search", search);
    if (startDate != null) queryParams.set("startDates", formatDate(startDate));
    if (endDate != null) queryParams.set("endDates", formatDate(endDate));
    if (current != null) queryParams.set("page", current);
    navigate(`${location.pathname}?${queryParams.toString()}`);
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
      title: "Người tạo",
      dataIndex: "name",
      key: "title",
    },
    {
      title: "Tác giả",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (createdDate) => formatDate(createdDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "2"
          ? "Chờ phê duyệt"
          : status === "7"
          ? "Gửi lại, chờ phê duyêt"
          : status === "3"
          ? "Đã phê duyệt"
          : status === "6"
          ? "Đã gửi cho đào tạo"
          : "Không xác định",
    },

    {
      title: () => <div>Action</div>,
      key: "action",
      render: (record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Link to={`/censor/detail-article/${record.id}`}>
              {<EyeOutlined />}
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card className="mb-2">
        <h1>Tìm kiếm</h1>
        <Row>
          <Col span={12} className="mr-4">
            <Input
              placeholder="Tìm kiếm theo tiêu đề bài viết và tác giả"
              onChange={(event) => setSearch(event.target.value)}
              value={search}
            />
          </Col>
          <Col span={10}>
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
                onClick={fetchArchiveData}
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
            dataSource={archive}
            rowKey="id"
            pagination={false}
          />
        </div>
        <div className="mt-5 text-center">
          {totalAchive > 1 && (
            <Pagination
              simple
              current={currentAchive}
              onChange={(value) => {
                setCurrent(value);
              }}
              total={totalAchive * 10}
            />
          )}
        </div>
      </Card>
    </div>
  );
};
export default AchiveArticle;
