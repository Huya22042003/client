import { Col, Layout, Menu, Row } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/images/logo/logo-udpm-3.png";
import FooterUser from "../../../components/user/guest/Footer";
const { Header, Content } = Layout;

const item = [
  {
    key: "home",
    style: { height: "90px", display: "flex", alignItems: "center" },
    label: (
      <NavLink to="/home">
        <span className="label">Trang chủ</span>
      </NavLink>
    ),
  },
  {
    key: "blog",
    style: { height: "90px", display: "flex", alignItems: "center" },
    label: (
      <NavLink to="/articel">
        <span className="label">Bài viết</span>
      </NavLink>
    ),
  },
  {
    key: "1",
    style: { height: "90px", display: "flex", alignItems: "center" },
    label: (
      <NavLink to="/blog">
        <span className="label">Blog</span>
      </NavLink>
    ),
  },
];

const DashboardGuestUser = ({ children }) => {
  var prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    if (document.getElementById("header")) {
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("header").style.top = "0";
      } else {
        document.getElementById("header").style.top =
          -document.getElementById("header").offsetHeight + "px";
      }
      prevScrollpos = currentScrollPos;
    }
  };
  return (
    <Layout className="layout bg-white">
      <Header
        id="header"
        style={{
          zIndex: 50,
          height: "90px",
          borderBottom: "1.7px solid rgb(230, 230, 230)",
        }}
        className="bg-white fixed left-0 right-0 top-0 transition-all"
      >
        <div className="flex items-center px-28" style={{ height: "90px" }}>
          <NavLink
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth", // Bật hiệu ứng cuộn mượt
              });
            }}
            to={"/home"}
            className="flex items-center w-24"
            style={{ marginLeft: "-50px" }}
          >
            <img
              src={logo}
              key={"logo"}
              alt="Logo bộ môn phát triển phần mềm"
            />
          </NavLink>
          <Row
            className="w-full h-full"
            style={{ borderBottom: "1px solid #97979763" }}
          >
            <Col className="h-full" span={24}>
              <Menu
                className="h-full justify-end items-center"
                theme="light"
                mode="horizontal"
                items={item}
              />
            </Col>
          </Row>
        </div>
      </Header>
      <Content>
        <div className="site-layout-content min-h-screen">{children}</div>
      </Content>

      <FooterUser></FooterUser>
    </Layout>
  );
};

export default DashboardGuestUser;
