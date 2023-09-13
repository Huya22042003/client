import React, { memo, useEffect, useState } from "react";
import { Col, Row, Select, Slider, Tooltip, Empty } from "antd";
import Chart from "react-google-charts";
import { CensorRegistrationPeriodAPI } from "../../../apis/censor/registration-period/registration-period.api";
import { ChartAPI } from "../../../apis/censor/chart/progress-chart.api";

const TotalChart = memo(() => {
  const [registrationPeriod, setRegistrationPeriod] = useState([]);
  const [registration, setRegistration] = useState([]);
  const [registrationPeriodId, setRegistrationPeriodId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3);
  const [selectedYear, setSelectedYear] = useState("");
  const [allYears, setAllYears] = useState([]);
  const [hasData, setHasData] = useState(false);

  const getChart = () => {
    CensorRegistrationPeriodAPI.getAll().then((response) => {
      setRegistrationPeriod(response.data);
      if (response.data.length > 0 && registrationPeriodId === "") {
        setRegistrationPeriodId(response.data[0].id);
      }
    });
  };

  const handleRegistrationPeriodChange = (e) => {
    setRegistrationPeriodId(e);
    setCurrentPage(1);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const getProgressChart = () => {
    ChartAPI.getPrChart({
      id: registrationPeriodId,
    }).then((response) => {
      setRegistration(response.data.data);
      console.log(response.data.data);
      if (response.data.data.length === 1 && response.data.data[0].userId === null) {
        setHasData(false);
      }else{
        setHasData(true);
      }
    });
  };

  const getAllYears = (registrationPeriod) => {
    const years = new Set();
    registrationPeriod.forEach((regis) => {
      const fromDateYear = new Date(regis.fromDate).getFullYear();
      years.add(fromDateYear.toString());
    });
    return Array.from(years);
  };

  const filteredRegistrationPeriods = registrationPeriod.filter((regis) => {
    if (selectedYear === "") {
      return true;
    }
    const fromDateYear = new Date(regis.fromDate).getFullYear();
    return fromDateYear.toString() === selectedYear.toString();
  });

  useEffect(() => {
    getChart();
    getProgressChart();
    setAllYears(getAllYears(registrationPeriod));
  }, [registrationPeriodId]);

  const generatePieData = () => {
    const pieData = [["Task", "Số lượng"]];

    let totalCompleted = 0;
    let totalNotCompleted = 0;

    registration.forEach((item) => {
      totalCompleted += item.numberArticleWritten;
      totalNotCompleted += item.numberArticleAssigned;
    });

    pieData.push(["Hoàn thành", totalCompleted]);
    pieData.push(["Chưa hoàn thành", totalNotCompleted]);

    return pieData;
  };

  const pieData = generatePieData();

  const pieOptions = {
    pieHole: 0.4,
  };

  const generateChartDataForColumnChart = () => {
    const data = [
      [
        "User",
        "Số bài viết đã viết",
        "Số bài viết chưa viết",
        { role: "annotation" },
      ],
    ];

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;

    const slicedData = registration.slice(startIndex, endIndex);

    slicedData.forEach((item) => {
      const totalArticles =
        item.numberArticleWritten + item.numberArticleAssigned;
      const percentWritten = (item.numberArticleWritten / totalArticles) * 100;
      const percentNotWritten =
        (item.numberArticleAssigned / totalArticles) * 100;

      data.push([
        item.userName,
        item.numberArticleWritten,
        item.numberArticleAssigned,
        `${percentWritten.toFixed(1)}% / ${percentNotWritten.toFixed(1)}%`,
      ]);
    });

    return data;
  };

  const columnChartData = generateChartDataForColumnChart();

  const handleSliderChange = (value) => {
    setCurrentPage(value);
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div>
      <div
        style={{
          borderRadius: "10px",
          marginTop: "-10px",
          paddingTop: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "20px",
          backgroundColor: "white",
        }}
      >
        <Row>
          <Select
            showSearch
            onChange={handleYearChange}
            defaultValue={""}
            defaultActiveFirstOption 
            style={{ width: "110px", marginRight: "10px" }}
          >
            <Select.Option value="">Tất cả đợt</Select.Option>
            {allYears.map((year) => (
              <Select.Option value={year} key={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
          <Select
          defaultActiveFirstOption
            onChange={handleRegistrationPeriodChange}
            defaultValue={"Chọn đợt viết bài"}
            style={{ width: "600px" }}
          >
            {filteredRegistrationPeriods.map((regis) => (
              <Select.Option value={regis.id} key={regis.id}>
                {regis.name.length > 60 ? `${regis.name.substring(0, 60)}...` : regis.name}{" "}
                ({formatDate(regis.fromDate)} - {formatDate(regis.toDate)})
              </Select.Option>
            ))}
          </Select>
        </Row>
        {hasData ? (
          <Row>
          <Col xs={8}>
            <div className=" ">
              <h2>Biểu đồ thống kê tổng tiến độ</h2>
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
          </Col>
          <Col xs={15} className="ml-1">
            <div className="chart-container">
              <Chart
                className="-ml-5 mt-5"
                width={"100%"}
                height={"320px"}
                chartType="ColumnChart"
                loader={<div>Loading Chart</div>}
                data={columnChartData}
                options={{
                  isStacked: true,
                  hAxis: {
                    title: "Người dùng",
                  },
                  vAxis: {
                    title: "Số bài viết",
                  },
                }}
                rootProps={{ "data-testid": "4" }}
              />
            </div>
            <Tooltip title={"Kéo để xem những người dùng khác"} placement="bottom">
              <div className="slider-container">
                <Slider
                  min={1}
                  max={Math.ceil(registration.length / usersPerPage)}
                  step={1}
                  value={currentPage}
                  onChange={handleSliderChange}
                  style={{
                    width: "50%",
                    margin: "0 auto",
                  }}
                />
              </div>
            </Tooltip>
          </Col>
        </Row>
        ):(
          <Empty description="Không có dữ liệu, vui lòng chọn đợt khác" style={{position: "absolute", top: "50%", transform: "translateY(-50%)", left: "0", right: "0", zIndex: "0"}}/>
        )}
      </div>
    </div>
  ); 
});

export default TotalChart;
