import React from "react";
import anh1 from "../../../../assets/images/home-decor-1.jpeg";
import { Avatar, Col, Row, Space, Typography } from "antd";
import {
  BookOutlined,
  CommentOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { useState, useEffect } from "react";
import moment from "moment";
import JoditEditor from "jodit-react";
import "./index.css";
import { ArticleAPI } from "../../../../apis/user/auth/article/article.api";
import { Link } from "react-router-dom";

const CardArticlesGuest = (props) => {
  const [cardsData, setCardsData] = useState([]);
  const [articleByAuthor, setArticleByAuthor] = useState([]);
  const [articleByCategory, setArticleByCategory] = useState([]);
  useEffect(() => {
    setCardsData(props.data);
  }, [props.data]);

  useEffect(() => {
    const fetchArticlesByAuthor = async () => {
      try {
        const dataByAuthor = {
          userId: cardsData.userId,
          size: 3,
        };
        const dataByCate = {
          categoryName: cardsData.nameCategory,
        };
        const response = await ArticleAPI.fetchAllArticleByAuthor(dataByAuthor);
        setArticleByAuthor(response.data.data.data);
        const response1 = await ArticleAPI.fetchAllArticleByCategory(
          dataByCate
        );
        setArticleByCategory(response1.data.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticlesByAuthor();
  }, [cardsData]);
  //   window.onscroll = function () {
  //     const content = document.getElementById("iconDetailArticl");
  //     if (content) {
  //       if (window.scrollY > this.prevScrollY) {
  //         content.className =
  //           "opacity-0 bg-white flex justify-between  rounded-lg shadow-md transition ease-in-out delay-150 duration-300";
  //       } else {
  //         content.className =
  //           "opacity-100 bg-white flex justify-between  rounded-lg shadow-md transition ease-in-out delay-150 duration-300";
  //       }

  //       this.prevScrollY = window.scrollY;
  //     }
  //   };

  return (
    <div
      className="justify-items-center"
      style={{
        paddingTop: "90px",
        paddingLeft: "150px",
        paddingRight: "150px",
        paddingBottom: "150px",
      }}
    >
      <Card id="iconDetailArticl" className=" bg-white rounded-lg pt-5">
        <div className="flex ">
          <Typography className="category1" variant="subtitle1">
            {cardsData.nameCategory}
          </Typography>
          <Typography
            variant="subtitle1"
            className="category2"
            style={{ marginLeft: "10px" }}
          >
            {/* Đợt đăng bài: */}
            {cardsData.namePeriod}
          </Typography>
        </div>
        <div></div>
        <div>
          {/* Tiêu đề bài viết */}
          <h3 className="text-5xl text-slate-900 font-bold not-italic">
            {cardsData.title}
          </h3>
        </div>
        <div className="flex justify-between ">
          <div className="flex">
            <Avatar src={anh1} style={{ width: "60px", height: "60px" }} />
            <div className="ml-3">
              <div className="flex">
                <Typography variant="subtitle1" className="name1">
                  {cardsData.name}
                </Typography>
              </div>
              <span>{moment(cardsData.browseDate).format("DD/MM/YYYY")}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex">
            <span className="flex items-center text-base">
              <HeartOutlined className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-125 hover:text-red-500 duration-300" />
              <span className="text-base ml-1">{cardsData.tym}</span>
            </span>
            <span className="flex items-center ml-4 text-base">
              <CommentOutlined className="hover:text-blue-500" />
              <span className="text-base ml-1">{cardsData.numberComments}</span>
            </span>
            <span className="flex items-center ml-4 text-base">
              <BookOutlined className="hover:text-blue-500" />
            </span>
            <span className="flex items-center ml-4 text-base">
              <ShareAltOutlined />
            </span>
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <JoditEditor
            value={cardsData.content}
            tabIndex={-1}
            config={{
              readonly: true,
              toolbar: false,
              showCharsCounter: false,
              showWordsCounter: false,
              showStatusbar: true,
              showPoweredBy: false,
              className: "view_editor_jodit",
              style: {
                backgroundColor: "#ffffff",
                border: "none",
              },
            }}
          />
        </div>
      </Card>

      <div>
        <div>
          <Row className="mt-16 mb-14">
            <Col span={24} className="text-center">
              <Link
                className="fancy justify-center items-center flex"
                href={`/articel?category=${"1"}`}
              >
                <hr className="w-full bg-gray-200 border-0" />
                <span
                  className="text w-full"
                  style={{
                    color: "gray",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  BÀI VIẾT KHÁC CỦA {cardsData.name}
                </span>
                <hr className="w-full bg-gray-200 border-0" />
              </Link>
            </Col>
          </Row>
          <Row className="justify-between">
            {articleByAuthor.map((item) => (
              <Col
                lg={11}
                sm={24}
                md={24}
                xs={24}
                style={{ marginTop: "20px" }}
              >
                <Card>
                  <div>
                    <div className="flex -ml-2">
                      <div className="flex ml-2">
                        <Avatar className="mb-2" src={anh1} />
                        <Typography className="ml-2 pt-1" variant="subtitle1">
                          {item.name}
                        </Typography>
                      </div>
                      <span className="text-3xl text-slate-900 font-normal ml-1 -mt-3 ">
                        .
                      </span>
                      <div className="flex ml-1 pt-1">
                        <span>
                          {moment(item.browseDate).format("DD/MM/YYYY")}
                        </span>
                        <span> </span>
                      </div>
                    </div>

                    <Meta
                      className="flex mb-4 "
                      style={{ marginTop: "-20px" }}
                      title={<span className="text-xl">{item.title}</span>}
                      description={
                        <span className="text-base">{item.descriptive}</span>
                      }
                    />
                    <div className="flex mt-3 -ml-3">
                      <span className="flex items-center ml-4 text-">
                        <HeartOutlined className="text-base" />
                        <span className="text-base ml-1 -mt-1">{item.tym}</span>
                      </span>
                      <span className="flex items-center ml-4 text-base">
                        <ShareAltOutlined className="text-base ml-1" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <div>
          <Row className="mt-16 mb-14">
            <Col span={24} className="text-center">
              <Link
                className="fancy justify-center items-center flex"
                href={`/articel?category=${"1"}`}
              >
                <hr className="w-full bg-gray-200 border-0" />
                <span
                  className="text w-full"
                  style={{
                    color: "gray",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  BÀI VIẾT CÙNG LOẠI {cardsData.nameCategory}
                </span>
                <hr className="w-full bg-gray-200 border-0" />
              </Link>
            </Col>
          </Row>
          <Row className="justify-between">
            {articleByCategory.map((item1) => (
              <Col
                lg={11}
                sm={24}
                md={24}
                xs={24}
                style={{ marginTop: "20px" }}
              >
                <Card>
                  <div>
                    <div className="flex -ml-2">
                      <div className="flex ml-2">
                        <Avatar className="mb-2" src={anh1} />
                        <Typography className="ml-2 pt-1" variant="subtitle1">
                          {item1.name}
                        </Typography>
                      </div>
                      <span className="text-3xl text-slate-900 font-normal ml-1 -mt-3 ">
                        .
                      </span>
                      <div className="flex ml-1 pt-1">
                        <span>
                          {moment(item1.browseDate).format("DD/MM/YYYY")}
                        </span>
                        <span> </span>
                      </div>
                    </div>

                    <Meta
                      className="flex mb-4"
                      title={<span className="text-xl">{item1.title}</span>}
                      description={
                        <span className="text-base">{item1.descriptive}</span>
                      }
                    />

                    <Space size={[0, 8]} wrap>
                      {/* {item1.hashtags.split(", ").map((el) => (
                        <Tag bordered={false} className="rounded-lg">
                          <Link href={`/articel?hashtag=`}>{el}</Link>
                        </Tag>
                      ))} */}
                    </Space>

                    <div className="flex mt-3 -ml-3">
                      <span className="flex items-center ml-4 text-">
                        <HeartOutlined className="text-base" />
                        <span className="text-base ml-1 -mt-1">
                          {item1.tym}
                        </span>
                      </span>
                      {/* <span className="flex items-center ml-4 text-base">
                        <CommentOutlined className="text-base ml-1" />
                        <span className="text-base ml-1">{item1.numberComment}</span>
                      </span> */}
                      <span className="flex items-center ml-4 text-base">
                        <ShareAltOutlined className="text-base ml-1" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default CardArticlesGuest;
