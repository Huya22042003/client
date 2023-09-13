import { Col, Row, Pagination, Input, Button, Select, Empty } from "antd";
import React, { useEffect, useState } from "react";
import CardGuestList from "./CardList";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { ArticleAPI } from "../../../../apis/user/auth/article/article.api";
import {
  GetArticles,
  SetArticles,
} from "../../../../app/reducers/articles/articles.reducer";

const { Option } = Select;

const ArticelGuestUser = () => {
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả thể loại"); // Đặt giá trị mặc định là "Tất cả thể loại"
  const [searchResult, setSearchResult] = useState([]);
  const pageSize = 4;

  const fetchData = () => {
    ArticleAPI.fetchAllArticle().then((response) => {
      const responseData = response.data.data;
      dispatch(SetArticles(responseData.data));
      setData(responseData.data);
      setSearchResult(responseData.data);
      setTotalPages(responseData.totalPages);
      setCurrent(responseData.currentPage + 1);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrent(page);
  };

  const handleSearch = () => {
    const filteredData = data.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(searchTitle.toLowerCase());
      const categoryMatch =
        selectedCategory === "Tất cả thể loại" || item.nameCategory === selectedCategory;
      return titleMatch && categoryMatch;
    });

    setSearchResult(filteredData);
    setCurrent(1);
  };

  const startIndex = (current - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedData = searchResult.slice(startIndex, endIndex);

  const categories = [...new Set(data.map((item) => item.nameCategory))];

  return (
    <div>
      <div
        className="m-auto scroll-smooth"
        style={{ paddingTop: "150px", background: "#fff" }}
      >
        <div style={{ maxWidth: "1336px" }} className="m-auto">
          <Row className="px-20">
            <Col lg={17} md={24} className="mx-4">
              {searchResult.length === 0 ? (
                <Empty description="Không có dữ liệu" />
              ) : (
                <CardGuestList data={displayedData} />
              )}
              <Pagination className="mt-5 text-center"
                current={current}
                total={totalPages * pageSize}
                pageSize={pageSize}
                onChange={handlePageChange}
                style={{ marginBottom: "20px" }}
              />
            </Col>
            <Col
              lg={6}
              md={0}
              style={{ borderLeft: "1px solid rgb(230, 230, 230)" }}
              className="pl-8"
            >
              <Input
                placeholder="Tìm kiếm theo tiêu đề"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />

              {/* Đặt giá trị mặc định của Select là "Tất cả thể loại" */}
              <Select
                placeholder="Lọc theo danh mục"
                style={{ width: "100%", marginTop: "10px" }}
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
              >
                {/* Thêm tùy chọn "Tất cả thể loại" */}
                <Option value="Tất cả thể loại">Tất cả thể loại</Option>
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>

              <Button
                type="primary"
                onClick={handleSearch}
                style={{ marginLeft: "35%", marginTop: "10px" }}
              >
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ArticelGuestUser;
