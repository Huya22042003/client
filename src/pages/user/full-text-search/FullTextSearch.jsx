import {
  AuditOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Col, Menu, Row } from "antd";
import React, { memo, useState } from "react";
// import ArticleFullTS from "./ArticleFullTS";
import AllFullTS from "./AllFullTS";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ResultUser from "./ResultUser";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem("Tat ca", "1", <AuditOutlined style={{ fontSize: "25px" }} />),
  {
    type: "divider",
  },
  getItem("Bai viet", "2", <FileTextOutlined style={{ fontSize: "25px" }} />),
  {
    type: "divider",
  },
  getItem(
    "Moi nguoi",
    "3",
    <UsergroupAddOutlined style={{ fontSize: "25px" }} />
  ),
];
const FullTextSearch = memo(() => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  useEffect(() => {
    if (!queryParams.get("search")) {
      if (search !== "") queryParams.set("search", search);
    }
    navigate(`${location.pathname}?${queryParams.toString()}`);
    setSearch(queryParams.get("search"))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!queryParams.get("search")) {
      if (search !== "") queryParams.set("search", search);
    }
    navigate(`${location.pathname}?${queryParams.toString()}`);
    setSearch(queryParams.get("search"))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.get("search")])

  const [selectedItem, setSelectedItem] = useState("1");
  const onClick = (e) => {
    const item = e.key;
    setSelectedItem(item);
  };
  return (
    <div>
      <Row>
        <h3>Kết quả tìm kiếm: { search ? search : "Không tìm thấy kết quả" }</h3>
      </Row>
      <Row className="justify-between">
        <Col xs={17} className="">
          {selectedItem === "3" ? <ResultUser /> : null}
          {/* {selectedItem === "2" ? <ArticleFullTS /> : null} */}
          {selectedItem === "1" ? <AllFullTS search={search} /> : null}
        </Col>

        <Col xs={6} style={{background: "#fff"}}>
          <Menu
            onClick={onClick}
            style={{
              fontSize: "18px"
            }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            items={items}
          />
        </Col>
      </Row>
    </div>
  );
});

export default FullTextSearch;
