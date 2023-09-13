import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  Badge,
  Dropdown,
  Button,
  Avatar,
  Input,
  List,
} from "antd";

import {
  SearchOutlined,
  MoreOutlined,
  BellFilled,
  ClockCircleFilled,
  UserOutlined,
} from "@ant-design/icons";

import { NavLink, Link } from "react-router-dom";
import avtar from "../../assets/images/team-2.jpg";
import anh1 from "../../assets/images/cancel.png";
import anh2 from "../../assets/images/check.png";
import anh3 from "../../assets/images/star.png";
const data = [
  {
    id: 1,
    title:
      "New message from SophieNew message from SophieNew message from SophieNew message from Sophie",
    description: (
      <>
        <ClockCircleFilled /> 2 days ago
      </>
    ),
    avatar: avtar,
    smallAvatar: anh1,
  },
  {
    id: 2,
    title: "New album by Travis Scott",
    description: (
      <>
        <ClockCircleFilled /> 2 days ago
      </>
    ),
    avatar: avtar,
    smallAvatar: anh3,
  },
  {
    id: 3,
    title: "Payment completed",
    description: (
      <>
        <ClockCircleFilled /> 2 days ago
      </>
    ),
    avatar: avtar,
    smallAvatar: anh2,
  },
];

function Header({ onSlidebar, onPress, name, subName }) {
  useEffect(() => window.scrollTo(0, 0));
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleItemHover = (itemId) => {
    setHoveredItem(itemId);
  };

  const menu = (
    <List
      style={{ width: "300px" }}
      className="header-notifications-dropdown"
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          className={`notification-item ${
            hoveredItem === item.id ? "hovered" : ""
          }`}
          onMouseEnter={() => handleItemHover(item.id)}
          onMouseLeave={() => handleItemHover(null)}
        >
          <List.Item.Meta
            avatar={
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  shape="circle"
                  src={item.avatar}
                  style={{ width: "50px", height: "50px" }}
                />
                <Avatar
                  shape="circle"
                  src={item.smallAvatar}
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
            title={item.title}
            description={item.description}
          />
          {hoveredItem === item.id && (
            <Button
              shape="circle"
              style={{ border: "none", boxShadow: "none", right: "0" }}
              className="notification-options absolute "
              icon={<MoreOutlined />}
            />
          )}
        </List.Item>
      )}
    />
  );

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={6}>
          <Breadcrumb className="p-0">
            <Breadcrumb.Item>
              <NavLink to="/">Pages</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ textTransform: "capitalize" }}>
              {name.replace("/", " / ")}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize" }}
            >
              {subName.replace("/", " / ")}
            </span>
          </div>
        </Col>
        <Col span={18} className="header-control">
          {/* chuông */}
          <Badge size="small" count={11}>
            <Dropdown
              overlay={menu}
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
