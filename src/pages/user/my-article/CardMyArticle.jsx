import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Space,
  Tooltip,
  Typography,
  Image,
} from "antd";
import Meta from "antd/es/card/Meta";
import { LineOutlined, StarFilled } from "@ant-design/icons";
import moment from "moment";
import { getImageUrl } from "../../../AppConfig";
import { Link } from "react-router-dom";

const CardMyArticle = (props) => {
  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    setCardsData(props.data);
  }, [props.data]);

  const UserInfoTooltip = ({ name, followCount, descriptive, img }) => (
    <div style={{ alignItems: "center", color: "#000" }}>
      <div className="flex">
        <Avatar src={img} />
        <p className="ml-3 mt-1 text-white-400" variant="subtitle1">
          {name}
        </p>
      </div>

      <p>{descriptive}</p>
      <hr />
      <Row>
        <Col span={12}>
          <p>Followers: {followCount}</p>
        </Col>
        <Col span={12}>
          <Button
            style={{ borderRadius: "20px" }}
            className="bg-green-500 mt-2 float-right  hover:bg-green-400 border-0"
          >
            <span style={{ color: "aliceblue" }}>Follow</span>
          </Button>
        </Col>
      </Row>
    </div>
  );
  return (
    <div className="pb-10">
      <div>
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-md relative mb-6"
          >
            <Card>
              <Row>
                <Col span={16}>
                  <div className="flex pb-2">
                    <div className="flex">
                      <Tooltip
                        key={card.id}
                        color="#fff"
                        placement="right"
                        title={<UserInfoTooltip {...card} />}
                      >
                        <Avatar src={card.img} />
                      </Tooltip>
                      <Typography
                        avatar={card.img}
                        variant="subtitle1"
                        className="ml-3 pt-1 font-bold"
                      >
                        {card.name}
                      </Typography>
                    </div>
                    <div className="flex pt-1">
                      <span>
                        <LineOutlined style={{ transform: "rotate(90deg)" }} />
                      </span>
                      <span>
                        {moment(card.createdDate).format("DD/MM/YYYY")}
                      </span>
                      <span className="text-yellow-400">
                        <StarFilled style={{ marginLeft: "10px" }} />
                      </span>
                      <span style={{ marginLeft: "10px" }}>
                        <Link href={`/articel?category=`}>
                          {card.nameCategory}
                        </Link>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <Meta
                      title={
                        <Tooltip title="Xem chi tiết">
                          <Link
                            to={`/user/my-article/${card.id}`}
                            className="text-xl text-black hover:text-black"
                          >
                            {" "}
                            {card.title}
                          </Link>
                        </Tooltip>
                      }
                      description={
                        <>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {/* HashTag */}
                            <Space
                              size={[0, 8]}
                              wrap
                              className="float-left mt-3"
                            >
                              {/* {card.hashtags.split(", ").map((el) => (
                                <Tag bordered={false} className="rounded-lg">
                                  <Link href={`/articel?hashtag=`}>{el}</Link>
                                </Tag>
                              ))} */}
                            </Space>

                            {/* Description */}
                            <div className="flex items-center">
                              <p
                                className="w-4/5"
                                style={{
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  maxWidth: "80%",
                                  width: "auto",
                                }}
                              >
                                {card.descriptive}
                              </p>{" "}
                              <Link
                                className="w-1/5"
                                to={`/user/my-article/${card.id}`}
                              >
                                Xem thêm
                              </Link>
                            </div>
                          </div>
                        </>
                      }
                      className="text-left"
                    />
                  </div>
                </Col>
                <Col span={8} className="flex justify-end items-center">
                  <div
                    style={{
                      borderRadius: "10px",
                      overflow: "hidden",
                      float: "right",
                    }}
                  >
                    <Image
                      style={{
                        height: "130px",
                        objectFit: "cover",
                      }}
                      alt="example"
                      src={getImageUrl(card.id)}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardMyArticle;
