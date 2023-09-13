import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Image,
  Row,
  message,
  Modal,
  Empty,
} from "antd";
import { TymAPI } from "../../../apis/user/auth/tym/tym.api";
import React, { useState, useEffect, memo } from "react";
import moment from "moment";
import { getImageUrl } from "../../../AppConfig";
import 'moment/locale/vi';
import { useNavigate } from "react-router-dom";

const MyFavouriteArticle = memo(() => {
  const groupArticlesByDate = (articles) => {
    const groupedArticles = {};

    if (!Array.isArray(articles)) {
      return groupedArticles;
    }

    articles.forEach((article) => {
      const date = moment(parseInt(article.createdDate)).format("L");

      if (groupedArticles[date]) {
        groupedArticles[date].push(article);
      } else {
        groupedArticles[date] = [article];
      }
    });

    return groupedArticles;
  };

  const [favouriteArticles, setFavouriteArticles] = useState([]);
  const [groupedFavouriteArticles, setGroupedFavouriteArticles] = useState({});
  const [checkedList, setCheckedList] = useState([]); // Danh sách các bài viết đã được chọn
  const [checkAll, setCheckAll] = useState(false); // Trạng thái "Check all"
  const [hasData, setHasData] = useState(false);
  const navigate = useNavigate();

  const fetchFavouriteArticles = async () => {
    try {
      const response = await TymAPI.getAllTymArticle();
      setFavouriteArticles(response.data.data);
      if (response.data.data.length > 0) {
        setHasData(true);
      } else {
        setHasData(false);
      }
    } catch (error) {
      console.error("Error fetching FavouriteArticles:", error);
    }
  };

  useEffect(() => {
    fetchFavouriteArticles();
  }, []);

  useEffect(() => {
    const groupedArticles = groupArticlesByDate(favouriteArticles);
    setGroupedFavouriteArticles(groupedArticles);
  }, [favouriteArticles]);

  const getDaysAgo = (createdDate) => {
    const date = moment(parseInt(createdDate));
    date.locale('vi'); // Đặt locale của moment thành tiếng Việt
    const daysAgo = date.fromNow(true);
    return daysAgo;
  };

  // Xử lý sự kiện khi chọn hoặc bỏ chọn một bài viết yêu thích
  const handleCheck = (articleId) => {
    const updatedCheckedList = [...checkedList];
    if (updatedCheckedList.includes(articleId)) {
      updatedCheckedList.splice(updatedCheckedList.indexOf(articleId), 1);
    } else {
      updatedCheckedList.push(articleId);
    }
    setCheckedList(updatedCheckedList);
    setCheckAll(updatedCheckedList.length === favouriteArticles.length);
  };

  // Xử lý sự kiện khi chọn hoặc bỏ chọn tất cả các bài viết yêu thích
  const handleCheckAll = () => {
    if (checkAll) {
      setCheckedList([]);
    } else {
      const allArticleIds = favouriteArticles.map((article) => article.id);
      setCheckedList(allArticleIds);
    }
    setCheckAll(!checkAll);
  };

  // Xử lý sự kiện khi nhấn nút xóa
  const handleDelete = () => {
    if (checkedList.length === 0) {
      message.error("Vui lòng chọn ít nhất một bài viết để xóa.");
      return;
    }
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        TymAPI.deleteAllTymArticle(checkedList)
          .then((response) => {
            setFavouriteArticles(response.data.data);
            if (response.status === 200) {
              message.success("Xóa các bài viết đã chọn thành công");
            } else {
              message.error("Xóa các bài viết đã chọn không thành công");
            }
            fetchFavouriteArticles();
          })
          .catch((error) => {
            message.error("Lỗi khi gọi API xóa bài viết:", error);
          });
      },
    });
  };

  const handleClickArticle = (id) => {
    navigate(`/user/article/${id}`);
  }

  return (
    <div>
      {hasData ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Checkbox
              indeterminate={!checkAll && checkedList.length > 0}
              onChange={handleCheckAll}
              checked={checkAll}
            >
              Tất cả
            </Checkbox>

            <Button
              type="danger"
              onClick={handleDelete}
              className=" bg-red-500 hover:bg-red-400 hover:border-red-400"
            >
              Xóa
            </Button>
          </div>

          <Divider />

          <div className="mb-4">
            {Object.entries(groupedFavouriteArticles).map(
              ([createdDate, favouriteArticles]) => (
                <Card key={createdDate} title={createdDate}>
                  {favouriteArticles.map((article, index) => (
                    <Row key={index} className="flex justify-between mb-3">
                      {/* <Space  > */}
                      <Col xl={1}>
                        <Checkbox
                          checked={checkedList.includes(article.id)}
                          onChange={() => handleCheck(article.id)} // Gọi hàm handleCheck khi thay đổi checkbox
                        />
                      </Col>
                      <Col xl={4}>
                        <Image
                          alt="example"
                          src={getImageUrl(article.id)}
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "5px",
                          }}
                        />
                      </Col>
                      <Col xl={19} className=" -pl-1">
                        <span className="text-lg" onClick={() => handleClickArticle(article.articleId)}>{article.title}</span>
                        <div>
                          {/* <span className="text-5xl text-slate-900 font-normal mr-1">
                                .
                              </span> */}
                          <span>{article.userName}</span>
                          <span> --- </span>
                          <span>
                            Đã thích {getDaysAgo(article.createdDate)} trước
                          </span>
                        </div>
                      </Col>
                      {/* </Space> */}
                    </Row>
                  ))}
                </Card>
              )
            )}
          </div>
        </>
      ) : (
        <Empty description={"Không có bài viết yêu thích"}
          style={{
            position: "absolute",
            top: "50%", transform:
              "translateY(-50%)",
            left: "0",
            right: "0",
            zIndex: "0"
          }}
        />
      )}
    </div>
  );
});

export default MyFavouriteArticle;
