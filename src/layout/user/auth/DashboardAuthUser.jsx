/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import logo from "../../../assets/images/logo/logo-udpm-3.png";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Drawer, Row, Menu, Col, Tooltip } from "antd";
import Header from "../../../components/user/auth/Header";
import {
  BarChartOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  HeartOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
const { Header: AntHeader, Content } = Layout;

function DashboardAuthUser({ children }) {
  const [visible, setVisible] = useState(false);
  const openDrawer = () => setVisible(!visible);
  const [count, setCount] = useState(250);
  const onSlidebar = () => {
    if (count === 70) setCount(250);
    else setCount(70);
  };
  const [fixed, setFixed] = useState(false);

  const handleFixedNavbar = (type) => setFixed(type);

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");
  let title = "";
  
  if (pathname.includes("user/create-article")) {
    title = "Tạo bài viết";
  }
  if (pathname.includes("user/article")) {
    title = "Bài viết";
  }
  if (pathname.includes("user/my-article")) {
    title = "Bài viết của tôi";
  }
  if (pathname.includes("user/search")) {
    title = "Tìm kiếm";
  }
  if (pathname.includes("user/my-favourite-article")) {
    title = "Bài viết yêu thích";
  }
  if (pathname.includes("user/profile")) {
    title = "Hồ sơ";
  }

  if (pathname.includes("user/history")) {
    title = "Lịch sử";
  }
  if (pathname.includes("user/trash")) {
    title = "Thống kê";
  }
  if (pathname.includes("user/album")) {
    title = "Album";
  }

  if (pathname.includes("user/chart")) {
    title = "Thống kê";
  }
  const [collapsed, setCollapsed] = useState(false);
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const items = [
    getItem(
      <Link to="/user/create-article">
        <EditOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>Tạo bài viết</span>
      </Link>,
      "1"
    ),
    getItem(
      <Link to="/user/article">
        <FileTextOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Danh sách bài viết
        </span>
      </Link>,
      "2"
    ),
    getItem(
      <Link to="/user/my-article">
        <SolutionOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Bài viết của tôi
        </span>
      </Link>,
      "3"
    ),
    getItem(
      <Link to="/user/my-favourite-article">
        <HeartOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>
          Bài viết yêu thích
        </span>
      </Link>,
      "4"
    ),
    getItem(
      <Link to="/user/album">
        <WalletOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>Album</span>
      </Link>,
      "5"
    ),
    getItem(
      <Link to="/user/history">
        <HistoryOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>Lịch sử</span>
      </Link>,
      "6"
    ),
    getItem(
      <Link to="/user/chart">
        <BarChartOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>Thống kê</span>
      </Link>,
      "7"
    ),
    getItem(
      <Link to="/user/trash">
        <DeleteOutlined style={{ marginRight: "8px", marginTop: 7 }} />
        <span style={{ marginLeft: 15, marginRight: 15 }}>Bài viết đã xóa</span>
      </Link>,
      "8"
    ),
  ];
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout
      className={`layout-dashboard ${
        pathname === "profile" ? "layout-profile" : ""
      } ${pathname === "rtl" ? "layout-dashboard-rtl" : ""}`}
    >
      <Drawer
        id="drawer_ui"
        title={false}
        placement={"left"}
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        key={"left"}
        width={250}
        style={{ background: "#fff", overflowX: "hidden" }}
        className={`drawer-sidebar ${
          pathname === "rtl" ? "drawer-sidebar-rtl" : ""
        } `}
      >
        <Layout
          id="layout_drawer"
          style={{ background: "#fff", overflowX: "hidden" }}
          className={` bg-white layout-dashboard ${
            pathname === "rtl" ? "layout-dashboard-rtl" : ""
          }`}
        >
          <Row className="flex justify-center align-middle  mt-5 pb-8">
            <div className="brand text-center">
              <Link to="/" className="active">
                <img
                  src={logo}
                  style={{
                    height: "80px",
                  }}
                  alt="Logo"
                />
              </Link>
            </div>
          </Row>
          <Menu mode="inline" items={items} onClick={openDrawer} />
        </Layout>
      </Drawer>
      <div className="bg-white">
        <Sider
          id="sildebar_ui"
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          className={`sider-primary ant-layout-sider-primary`}
          style={{ background: "#fff", overflowX: "hidden" }}
        >
          <Row className="flex justify-center align-middle  mt-5 pb-8">
            {!collapsed && (
              <div className="brand text-center">
                <Link to="/" className="active">
                  <img
                    src={logo}
                    style={{
                      height: "80px",
                    }}
                    alt="Logo"
                  />
                </Link>
              </div>
            )}
          </Row>

          <Menu mode="inline" items={items} />
        </Sider>
      </div>
      <Layout className="pb-14">
        <AntHeader className={`${fixed ? "ant-header-fixed" : ""}`}>
          <Row className="flex justify-between">
            <Col span={6} className="flex items-center">
              <button className="buttonSlider desktop" onClick={toggleCollapse}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>
              <button className="buttonSlider mobile" onClick={openDrawer}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>

              <Tooltip title={title}>
                <h1
                  style={{
                    marginLeft: "20px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "200px",
                  }}
                >
                  {title}
                </h1>
              </Tooltip>
            </Col>
            <Col span={18}>
              <Header
                onPress={openDrawer}
                onSlidebar={onSlidebar}
                name={pathname}
                subName={pathname}
                handleFixedNavbar={handleFixedNavbar}
              />
            </Col>
          </Row>
        </AntHeader>
        <Content className="content-ant">{children}</Content>
      </Layout>
    </Layout>
  );
}
export default DashboardAuthUser;
