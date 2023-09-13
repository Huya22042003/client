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
  Select,
  Tabs,
  Badge,
  Input,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import locale from "antd/es/date-picker/locale/vi_VN";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import {
  AddApproveArticles,
  GetArticles,
  SetArticles,
} from "../../../app/reducers/articles/articles.reducer";
import "./index.css";
import { CensorAPI } from "../../../apis/censor/article/article.api";
import {
  connectStompClient,
  getStompClient,
} from "../../../apis/stomp-client/config";
import SendArticle from "./SendArticle";
import AchiveArticle from "./AchiveArticle";
import { NotificationAPI } from "../../../apis/censor/notification/notification.api";
import { SetCountNotification } from "../../../app/reducers/notification/count-notification.reducer";
import { SetNotification } from "../../../app/reducers/notification/notification.reducer";

export default function DanhSachActicles() {
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  let [count, setcount] = useState(0);

  // const handleSearchFromURL = () => {
  //   const queryParams = new URLSearchParams(location.search);
  //   const search = queryParams.get("search");
  //   const startDate = queryParams.get("startDate");
  //   const endDate = queryParams.get("endDate");
  //   const page = queryParams.get("page");

  //   setSearch(search || "");
  //   setStartDate(startDate || null);
  //   setEndDate(endDate || null);
  //   setCurrent(page ? parseInt(page, 10) : 1);
  //   fetchData();
  // };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    connectStompClient();
  }, []);

  const stompClient = getStompClient();
  const connect = () => {
    stompClient.connect({}, () => {
      stompClient.subscribe(
        "/portal-articles/create-article",
        function (message) {
          let data = JSON.parse(message.body).data;
          dispatch(AddApproveArticles(data));
          fetchData();
          countApprovedArticle();
          fetchNotification();
          fetchCountNotification();
        }
      );
    });
  };

  useEffect(() => {
    if (stompClient != null) {
      connect();
    }
    return () => {
      if (stompClient != null) {
        getStompClient().disconnect();
      }
    };
  }, [stompClient]);

  const fetchNotification = () => {
    return NotificationAPI.fetchAll({ page: current - 1 }).then((response) => {
      dispatch(SetNotification(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
  };

  const fetchCountNotification = () => {
    return NotificationAPI.fetchCountNotification().then((response) => {
      dispatch(SetCountNotification(response.data.data));
    });
  };

  const countApprovedArticle = () => {
    CensorAPI.countApprovedArticle({}).then((response) => {
      setcount(response.data.data);
    });
  };

  useEffect(() => {
    countApprovedArticle();
  }, []);

  useEffect(() => {
    fetchData();
  }, [current]);

  const fetchData = () => {
    CensorAPI.fetchAll({
      search: search,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime(),
      page: current - 1,
    }).then((response) => {
      dispatch(SetArticles(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCurrent(response.data.data.currentPage + 1);
    });
    const queryParams = new URLSearchParams(location.search);
    if (search != "") queryParams.set("search", search);
    if (startDate != null) queryParams.set("startDates", formatDate(startDate));
    if (endDate != null) queryParams.set("endDates", formatDate(endDate));
    if (current != null) queryParams.set("page", current);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const data = useAppSelector(GetArticles);

  // useEffect(() => {
  //   handleSearchFromURL();
  // }, [location.search]);

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
            <Link to={`/censor/article/${record.id}`}>{<EyeOutlined />}</Link>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const { TabPane } = Tabs;

  const innerTabItems = [
    {
      key: "3",
      label: "Bài viết đã gửi",
      children: <SendArticle />,
    },
    {
      key: "4",
      label: "Bài viết trong kho",
      children: <AchiveArticle />,
    },
  ];

  const items = [
    {
      key: "1",
      label: "Bài viết cần phê duyệt",
      children: (
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
                    onClick={fetchData}
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
              {total > 1 && (
                <Pagination
                  simple
                  current={current}
                  onChange={(value) => {
                    setCurrent(value);
                  }}
                  total={total * 10}
                />
              )}
            </div>
          </Card>
        </div>
      ),
      badgeCount: count,
    },
    {
      key: "2",
      label: "Bài viết đã phê duyệt",
      children: (
        //tab con
        <Tabs defaultActiveKey="3">
          {innerTabItems.map((item) => (
            <TabPane
              tab={
                <span>
                  {item.label}{" "}
                  <Badge
                    overflowCount={100}
                    count={item.badgeCount}
                    className="custom-badge"
                    style={{ backgroundColor: "red", borderRadius: "50%" }}
                  />
                </span>
              }
              key={item.key}
            >
              {item.children}
            </TabPane>
          ))}
        </Tabs>
      ),
    },
  ];
  return (
    <>
      <Tabs defaultActiveKey="1">
        {items.map((item) => (
          <TabPane
            tab={
              <span>
                {item.label}{" "}
                <Badge
                  overflowCount={100}
                  count={item.badgeCount}
                  className="custom-badge"
                  style={{ backgroundColor: "red", borderRadius: "50%" }}
                />
              </span>
            }
            key={item.key}
          >
            {item.children}
          </TabPane>
        ))}
      </Tabs>
    </>
  );
}
