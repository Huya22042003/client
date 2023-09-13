import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import { CharArticleAPI } from "../../../apis/user/auth/chart/chart-article.api";

function BarChart() {
  const [getArticlesData, setArticlesData] = useState([]);

  const fetchArticle = () => {
    CharArticleAPI.findAllArticleBrowseDate().then((response) => {
      const convertedData = response.data.data.map((item) => {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}/${month}/${day}`;
        return {
          ...item,
          date: formattedDate,
        };
      });
      setArticlesData(convertedData);
    });
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  const config = {
    data: getArticlesData,
    isGroup: true,
    xField: "date",
    yField: "numberArticle",
    seriesField: "approvalStatus",
    dodgePadding: 2,
    label: {
      position: "middle",
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
    slider: {
      start: 0.1,
      end: 0.5,
    },
  };

  return <Column {...config} />;
}

export default BarChart;
