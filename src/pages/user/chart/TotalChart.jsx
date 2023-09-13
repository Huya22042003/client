import React, { memo, useState, useEffect } from "react";
import { Button, Col, Divider, Row, Space } from "antd";
import LineChart from "./LineChart";
import CombinedChart from "./MultipChart";
import DonutChart from "./DonutChart";
import "./index.css";
import { Line } from "@ant-design/plots";
import { CharArticleAPI } from "../../../apis/user/auth/chart/chart-article.api";
import BarChart from "./BarChart";

const TotalChart = memo(() => {
  const [activeChart, setActiveChart] = useState("article");
  const [getArticlesData, setArticlesData] = useState([]);

  const fetchArticle = () => {
    CharArticleAPI.getArticleByDate().then((response) => {
      const convertedData = response.data.data;
      setArticlesData(convertedData);
    });
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  console.log(getArticlesData);

  const config = {
    data: getArticlesData,
    padding: "auto",
    xField: "date",
    yField: "numberArticle",
    xAxis: {
      tickCount: 5,
    },
    slider: {
      start: 0.1,
      end: 0.5,
    },
  };

  return (
    <div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          marginTop: "20px",
          paddingTop: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "20px",
          backgroundColor: "white",
        }}
      >
        <Row className="flex justify-between ">
          <Col xl={23} className="mb-4 ">
            <Space
              className="mr-4"
              style={{ display: "flex", justifyContent: "flex-end" }}
              split={<Divider type="vertical" />}
            >
              <Button
                style={{ borderRadius: "20px" }}
                onClick={() => setActiveChart("article")}
                className={activeChart === "article" ? "active-button" : ""}
              >
                Bài viết
              </Button>
            </Space>
          </Col>
        </Row>
        {activeChart === "article" && <Line {...config} />}
        {/* {activeChart === "comment" && <LineChart />}
        {activeChart === "status" && <LineChart />}
        {activeChart === "all" && <CombinedChart />} */}
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          marginTop: "20px",
          paddingTop: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "20px",
          backgroundColor: "white",
        }}
      >
        <Row>
          <Col xs={8}>
            <DonutChart></DonutChart>
          </Col>
          <Col xs={15} className="ml-1">
            <BarChart></BarChart>
          </Col>
        </Row>
      </div>
    </div>
  );
});

export default TotalChart;
