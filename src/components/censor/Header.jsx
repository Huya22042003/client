import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Badge,
  Dropdown,
  Button,
  Avatar,
  Input,
  List,
  Menu,
} from "antd";

import {
  SearchOutlined,
  MoreOutlined,
  BellFilled,
  ClockCircleFilled,
  UserOutlined,
} from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";
import avtar from "../../assets/images/team-2.jpg";
import tym from "../../assets/images/38064371 (2).jpg";
import comment from "../../assets/images/38064371 (3).jpg";
import approved from "../../assets/images/check.png";
import refuse from "../../assets/images/cancel.png";
import evaluate from "../../assets/images/star.png";
import {
  GetNotification,
  SetNotification,
} from "../../app/reducers/notification/notification.reducer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import moment from "moment";
import { NotificationAPI } from "../../apis/censor/notification/notification.api";
import {
  GetCountNotification,
  SetCountNotification,
} from "../../app/reducers/notification/count-notification.reducer";

function Header({ onSlidebar, onPress, name, subName }) {
  useEffect(() => window.scrollTo(0, 0));
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [countNotification, setCountNotification] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);

  const fetchNotification = () => {
    return NotificationAPI.fetchAll({ page: current - 1 }).then((response) => {
      dispatch(SetNotification(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchCountNotification = () => {
    return NotificationAPI.fetchCountNotification().then((response) => {
      console.log(response.data.data);
      dispatch(SetCountNotification(response.data.data));
    });
  };

  useEffect(() => {
    fetchCountNotification();
  }, []);

  const dataNotification = useAppSelector(GetNotification);
  const dataCountNotification = useAppSelector(GetCountNotification);
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleItemHover = (itemId) => {
    setHoveredItem(itemId);
  };
  const AvatarMap = {
    1: comment,
    2: approved,
    3: evaluate,
    4: tym,
    5: refuse,
  };

  const deleteNotification = async (id) => {
    try {
      const response = await NotificationAPI.delete(id);
      if (response.status === 200) {
        const updatedData = dataNotification.filter((item) => item.id !== id);
        dispatch(SetNotification(updatedData));
        const newResponse = await NotificationAPI.fetchNotification();
        const newData = newResponse.data.data.data;
        dispatch(SetNotification(newData));
        const newCount = countNotification - 1;
        setCountNotification(newCount);
      }
    } catch (error) {}
  };
  const handleItemClick = (item) => {
    navigate(`/censor/article/${item.articlesId}`);
  };
  
  const markAsRead = () => {
    NotificationAPI.markAllAsRead().then(() => {
      fetchCountNotification();
    })
  };

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={6}></Col>
        <Col span={18} className="header-control">
          {/* chuông */}
          <Badge size="small" count={dataCountNotification}>
            <Dropdown
              overlay={
                <>
                  <div style={{ backgroundColor: "white", marginTop: "20px", marginBottom: "-10px" }}>
                    <Button
                      type="link"
                      style={{ width: "100%" , textAlign: "left"}}
                      onClick={() => markAsRead()}
                    > 
                      <u>Đánh dấu tất cả đã đọc</u>
                    </Button>
                  </div>
                <List
                  style={{ width: "300px" }}
                  className="header-notifications-dropdown"
                  itemLayout="horizontal"
                  dataSource={dataNotification}
                  renderItem={(item) => (
                    <List.Item
                      className={`notification-item ${
                        hoveredItem === item.id ? "hovered" : ""
                      }`}
                      onMouseEnter={() => handleItemHover(item.id)}
                      onMouseLeave={() => handleItemHover(null)}
                      onClick={() => handleItemClick(item)}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <Avatar
                              shape="circle"
                              src={avtar}
                              style={{ width: "50px", height: "50px" }}
                            />
                            <Avatar
                              shape="circle"
                              src={AvatarMap[item.type]}
                              style={{
                                width: "25px",
                                height: "25px",
                                position: "absolute",
                                bottom: "-5px",
                                right: 0,
                              }}
                            />
                          </div>
                        }
                        title={item.contentActivity}
                        description={
                          <>
                            <ClockCircleFilled />{" "}
                            {moment(item.createdDate).format("DD/MM/YYYY")}
                          </>
                        }
                      />
                      {hoveredItem === item.id && (
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item
                                key="delete"
                                onClick={() => deleteNotification(item.id)}
                              >
                                <a href="# ">Xóa</a>
                              </Menu.Item>
                            </Menu>
                          }
                          trigger={["click"]}
                        >
                          <Button
                            shape="circle"
                            style={{
                              border: "none",
                              boxShadow: "none",
                              right: "0",
                            }}
                            className="notification-options absolute "
                            icon={<MoreOutlined />}
                          />
                        </Dropdown>
                      )}
                    </List.Item>
                  )}
                />
                </>
              }
              trigger={["click"]}
              visible={isOpen}
              onVisibleChange={toggleNotifications}
              placement="bottomRight"
              overlayClassName="notification-dropdown"
            >
              <a
                href="#pablo"
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <BellFilled />
              </a>
            </Dropdown>
          </Badge>
          <Link to="/sign-in" className="btn-sign-in">
            <UserOutlined />
            <span>Sign in</span>
          </Link>
          <Input
            className="header-search"
            placeholder="Type here..."
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>
    </>
  );
}

export default Header;
