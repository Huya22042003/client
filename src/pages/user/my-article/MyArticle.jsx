import { Avatar, Col, Pagination, Row, Tabs } from "antd";
import { useEffect } from "react";
import { MyArticleAPI } from "../../../apis/user/auth/article/my-article.api";
import { UserAPI } from "../../../apis/user/my-user.api";
import { useState } from "react";
import { memo } from "react";
import Link from "antd/es/typography/Link";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { GetUser, SetUser } from "../../../app/reducers/users/users.reducer";
import {
  GetArticles,
  SetArticles,
} from "../../../app/reducers/articles/articles.reducer";
import CardMyArticle from "./CardMyArticle";

const MyArticle = memo(() => {
  const dispatch = useAppDispatch();
  const [userId, setUserId] = useState("");
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);

  const fetchMyUser = () => {
    UserAPI.findByUserId().then((response) => {
      dispatch(SetUser([response.data.data]));
      setUserId(response.data.data.id);
    });
  };
  useEffect(() => {
    fetchMyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userData = useAppSelector(GetUser);

  const fetchMyArticles = (key) => {
    const statusData = {
      userId: userId,
      title: "",
      status: parseInt(key),
      page: current - 1,
    };
    return MyArticleAPI.findMyArticleByStatus(statusData).then((response) => {
      dispatch(SetArticles(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
  };

  const fetchAllMyArticles = () => {
    MyArticleAPI.fetchAll({ page: current - 1 }).then((response) => {
      dispatch(SetArticles(response.data.data.data));
      setTotal(response.data.data.totalPages);
    });
  };

  useEffect(() => {
    fetchAllMyArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const dataArticle = useAppSelector(GetArticles);

  const onChange = (key) => {
    if (key === "10") {
      fetchAllMyArticles();
    } else {
      fetchMyArticles(key);
    }
  };

  const items = [
    {
      key: "10",
      label: `All`,
    },
    {
      key: "1",
      label: `Bản nháp`,
    },
    {
      key: "2",
      label: `Chờ phê duyệt `,
    },

    {
      key: "3",
      label: `Đã phê duyệt`,
    },

    {
      key: "4",
      label: `Bị từ chối`,
    },
  ];
  return (
    <div className="-mt-12">
      {userData.map((user) => (
        <Row>
          <Col lg={17}>
            <div>
              <h4 className="text-3xl" key={user.id}>
                {user.name}
              </h4>
            </div>
            <div>
              <Tabs defaultActiveKey="10" onChange={onChange}>
                {items.map((item) => (
                  <Tabs.TabPane key={item.key} tab={item.label}>
                    {item.children}
                    {dataArticle.length > 0 ? (
                      <CardMyArticle data={dataArticle} />
                    ) : (
                      <p>Không có bài viết</p>
                    )}
                    <div className="mt-5 text-center">
                      {total > 1 && (
                        <Pagination
                          simple
                          current={current}
                          onChange={(value) => {
                            setCurrent(value);
                          }}
                          total={total * 10}
                        />
                      )}
                    </div>
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </div>
          </Col>
          <Col lg={6} className="ml-7">
            <div>
              <div
                className="pt-16 "
                style={{
                  borderBottom: "1px solid rgba(242, 242, 242, 1)",
                }}
              >
                <div>
                  <Link href="">
                    <Avatar
                      src={user.img}
                      style={{ width: "72px", height: "72px" }}
                    />
                  </Link>
                </div>
                <div className=" -mt-3 mb-3">
                  <div>
                    <h3 className="text-2xl font-medium mb-3" key={user.id}>
                      {user.name}
                    </h3>
                    <p>
                      Psychologist and blogger. I help people use psychology for
                      meaningful personal growth: https://nickwignall.com
                    </p>
                  </div>
                  {/* <div className="mt-6 ">
                    <Button
                      className="rounded-3xl border-black bg-black px-4 py-2 text-white h-9 w-16 leading-2"
                      style={{
                        borderRadius: "30px",
                      }}
                    >
                      Follow
                    </Button>
                    <Button
                      className=" border-2 border-black bg-black  text-sm  ml-2"
                      style={{
                        borderRadius: "99em",
                        padding: "4px 9px",
                        color: " rgba(255, 255, 255, 1)",
                        lineHeight: "10px",
                      }}
                    >
                      <MailOutlined className="ml-1" />
                    </Button>
                  </div> */}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      ))}
    </div>
  );
});

export default MyArticle;
