import { Avatar, Col, Row, Tabs } from "antd";
import CardDemo from "../card/ViewCard";
import { useEffect } from "react";
import { ArticleAPI } from "../../../apis/user/auth/article/article.api";
import { useState } from "react";
import { memo } from "react";

import Link from "antd/es/typography/Link";
import anh1 from "../../../assets/images/face-1.jpg";

const ProfileUser = memo(() => {
  const [articles, setArticles] = useState([]);
  const [showCard, setShowCard] = useState(false);
  // const [setIsEmpty] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const onChange = (key) => {
    setShowCard(key === "1");
    console.log(key);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await ArticleAPI.fetchAllArticle();
        setArticles(response.data.data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);
  useEffect(() => {
    setIsEmpty(articles.length === 0);
  }, [articles]);

  const items = [
    {
      key: "1",
      label: `Home`,
      // children: `Content of Tab Pane 1`,
    },
    {
      key: "2",
      label: `About`,
      children: `Content of Tab Pane 2`,
    },
  ];
  return (
    <div>
      <Row>
        <Col lg={17}>
          <div>
            <h4 className="text-3xl">Nick Wignall</h4>
          </div>
          <div>
            <Tabs defaultActiveKey="1" onChange={onChange}>
              {items.map((item) => (
                <Tabs.TabPane key={item.key} tab={item.label}>
                  {item.children}
                  {showCard && <CardDemo data={articles} />}

                  {/* {isEmpty ? <Empty description="No data" /> : item.children}
                  {showCard && !isEmpty && <CardDemo data={articles} />} */}
                </Tabs.TabPane>
              ))}
            </Tabs>
          </div>
        </Col>
        <Col lg={6} className="ml-7">
          <div>
            <articlesdiv
              className="pt-16 "
              style={{
                borderBottom: "1px solid rgba(242, 242, 242, 1)",
              }}
            >
              <div>
                <Link href="">
                  <Avatar
                    src={anh1}
                    style={{ width: "72px", height: "72px" }}
                  />
                </Link>
              </div>
              <div className=" -mt-3 mb-3">
                <div>
                  <h3 className="text-2xl font-medium mb-3">Nick Wignall</h3>
                  <Link href="">Edit profile</Link>
                </div>
              </div>
            </articlesdiv>
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default ProfileUser;
