import React from "react";
import {
  Row,
  Col,
  Skeleton,
} from "antd";
import CardDemo from "../../card/ViewCard";
import { ArticleAPI } from "../../../../apis/user/auth/article/article.api";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  AddArticles,
  GetArticles,
  SetArticles,
} from "../../../../app/reducers/articles/articles.reducer";

const ListArticel = () => {
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);

  window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    const content = document.getElementById("content");
    if (content) {
      if (current < total) {
        if (currentScrollPos + 516 > content.offsetHeight * (4 / 5)) {
          setLoading(true);
          fetchArticles();
        }
        setCheck(false);
      } else {
        setCheck(true);
      }
    }
  };

  useEffect(() => {
    ArticleAPI.fetchAllArticle({
      page: current,
    }).then((response) => {
      dispatch(SetArticles(response.data.data.data));
      setLoading(false);
      setTotal(response.data.data.totalPages);
      setCurrent(response.data.data.currentPage + 1);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchArticles = () => {
    ArticleAPI.fetchAllArticle({
      page: current,
    }).then((response) => {
      response.data.data.data.forEach((element) => {
        dispatch(AddArticles(element));
      });
      setLoading(false);
      setTotal(response.data.data.totalPages);
      setCurrent(response.data.data.currentPage + 1);
    });
  };

  const articles = useAppSelector(GetArticles);

  // const dataa = [
  //   {
  //     title: "Ant Design Title 1Ant Design Title 1Ant Design Title 1",
  //   },
  //   {
  //     title: "Ant Design Title 2",
  //   },
  // ];
  return (
    <div>
      <Row
        id="content"
        style={{ maxWidth: "1336px" }}
        className="justify-center m-auto"
      >
        <Col xl={23}>
          <div className="px-10">
            <CardDemo data={articles} />

            <Skeleton
              avatar
              paragraph={{
                rows: 2,
              }}
              loading={loading}
            ></Skeleton>
            {check && <div>It is all, nothing more 🤐 </div>}
          </div>
        </Col>
        {/* <Col xl={6}>
          <Card className="mb-4">
            <span>Tìm kiếm</span>
            <Row className="mt-2">
              <Input
                placeholder="Tìm Kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                shape="circle"
                icon={<SearchOutlined />}
                className="right-0 mr-7 border-none  absolute"
                style={{
                  boxShadow: "none",
                  height: "35px",
                  marginTop: "1px",
                }}
                onClick={fetchArticles}
              />
            </Row>
          </Card>
          <Card className="mb-4">
            <span>Categories</span>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
          <Card className="mb-4">
            <span>Recent post</span>
            <div className="mt-2">
              <List
                itemLayout="horizontal"
                dataSource={dataa}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Image
                          alt="example"
                          src={anh1}
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                        />
                      }
                      title={
                        <Link href="https://ant.design">{item.title}</Link>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
          <Card>
            <span>Tags</span>
            <Row className="mt-2">
              <Input placeholder="Search..." />
              <Button
                shape="circle"
                icon={<SearchOutlined />}
                className="right-0 mr-7 border-none  absolute"
                style={{
                  boxShadow: "none",
                  height: "35px",
                  marginTop: "1px",
                }}
              />
            </Row>
            <div className="mt-3">
              <Tag bordered={false} className="rounded-lg mb-1">
                <Link>#1234</Link>
              </Tag>
              <Tag bordered={false} className="rounded-lg">
                <Link>#1234</Link>
              </Tag>
              <Tag bordered={false} className="rounded-lg">
                <Link>#1234</Link>
              </Tag>
              <Tag bordered={false} className="rounded-lg">
                <Link>#1234</Link>
              </Tag>
            </div>
          </Card>
        </Col> */}
      </Row>
    </div>
  );
};

export default ListArticel;
