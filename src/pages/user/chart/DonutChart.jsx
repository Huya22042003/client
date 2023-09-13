import Chart from "react-google-charts";
import { useEffect, useState } from "react";
import { CharArticleAPI } from "../../../apis/user/auth/chart/chart-article.api";

function DonutChart() {
  const [getSumArticle, setSumArticle] = useState("");
  const [getArticlesData, setArticlesData] = useState("");

  const fetchArticle = () => {
    CharArticleAPI.getAllArticle().then((response) => {
      setArticlesData(response.data.data.numberArticle);
    });
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchNumberArticle = () => {
    CharArticleAPI.getNumberArticle().then((response) => {
      setSumArticle(response.data.data.numberArticle);
    });
  };
  useEffect(() => {
    fetchNumberArticle();
  }, []);

  let remainingArticles = getSumArticle - getArticlesData;

  const isCompleted = getArticlesData >= getSumArticle;

  if (isCompleted) {
    remainingArticles = 0;
  }

  const pieData = [
    ["Task", "Hours per Day"],
    ["Hoàn thành", getArticlesData],
    ["Chưa hoàn thành", remainingArticles],
  ];

  const pieOptions = {
    pieHole: 0.4,
  };

  return (
    <div className=" ">
      <h2>Biểu đồ thống kê tổng tiến độ</h2>
      {isCompleted && <p>Đã hoàn thành tất cả bài viết!</p>}
      <Chart
        className="-ml-5 mt-5"
        width={"500px"}
        height={"320px"}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={pieData}
        options={pieOptions}
        rootProps={{ "data-testid": "3" }}
      />
    </div>
  );
}
export default DonutChart;
