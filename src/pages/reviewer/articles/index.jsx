import {
  Pagination,
  Card,
  Select,
  Table,
  Button,
  Tooltip,
  DatePicker,
  Row,
  Col,
} from "antd";
import { useEffect, useState } from "react";
import React from 'react';
import "./index.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { ReivewerArticleAPI } from "../../../apis/reviewer/reviewer.articles.api";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { GetArticles, SetArticles } from "../../../app/reducers/articles/articles.reducer";

export default function Reviewer() {
    const dispatch = useAppDispatch();
    const [current, setCurrent] = useState(0);
    const [total, setTotal] = useState(0);
    const { Option } = Select;
    const navigate = useNavigate();
    const displayedPage = current + 1;

    const [sortOrder, setSortOrder] = useState("oldest");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    setCurrent(0);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

    const location = useLocation();

    const getAllReviewers = () => {
        ReivewerArticleAPI.fetchAllArticleSearch({
            sortOrder: sortOrder,
            startDate: new Date(startDate).getTime(),
            endDate: new Date(endDate).getTime(),
            page: current,
          }).then((response) => {
            dispatch(SetArticles(response.data.data.data));
            setTotal(response.data.data.totalPages);
            setCurrent(current);
          });
          const queryParams = new URLSearchParams(location.search);
          if (sortOrder !== "") queryParams.set("sortOrder", sortOrder);
          if (startDate !== null) queryParams.set("startDates", formatDate(startDate));
          if (endDate !== null) queryParams.set("endDates", formatDate(endDate));
          if (current !== null) queryParams.set("page", current);
          navigate(`${location.pathname}?${queryParams.toString()}`);
    }

    const dataArticle = useAppSelector(GetArticles);

    useEffect(() => {
        getAllReviewers();
    }, [current, sortOrder]);

    const handlePaginationChange = (page) => {
        setCurrent(page - 1);
    };
    const handleDetailClick = (id) => {
        navigate(`/reviewer/article/${id}`);
    };

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="reviewer">
            <Card className="mb-2">
                <Row>
                    <Col span={14}>
                        <h1>Sắp xếp theo ngày đăng</h1>
                        <Select value={sortOrder} onChange={handleSortOrderChange} className="select-sort-type">
                            <Option value="">Choose sort type</Option>
                            <Option value="newest">Tăng dần</Option>
                            <Option value="oldest">Giảm dần</Option>
                        </Select>
                    </Col>
                    <Col span={10}>
                        <h1>Tìm kiếm</h1>
                        <DatePicker value={startDate} onChange={handleStartDateChange} locale={locale} className="datePicker" placeholder="Từ ngày" />
                        <DatePicker value={endDate} onChange={handleEndDateChange} locale={locale} className="datePicker" placeholder="Đến ngày" />
                        <Button type="primary" className="search-button" onClick={getAllReviewers} icon={<SearchOutlined />}>Search</Button>
                    </Col>
                </Row>
            </Card>
            <div>
                <div>
                    <Card>
                        <Table dataSource={dataArticle} pagination={false}>
                            <Table.Column
                                key="index"
                                title="STT"
                                dataIndex="index"
                                render={(_, reviewers, index) => index + 1}
                            />
                            <Table.Column
                                key="title"
                                title="Tiêu đề"
                                dataIndex="title"
                                render={(text) =>
                                    text.length > 60 ? `${text.substring(0, 60)} ...` : text
                                }
                            />
                            <Table.Column key="name" title="Người đăng" dataIndex="name" />
                            <Table.Column key="hashtags" title="Hashtags" dataIndex="hashtags" />
                            <Table.Column
                                key="date"
                                title="Ngày tạo"
                                dataIndex="createdDate"
                                render={(createdDate) => formatDate(createdDate)}
                            />
                            <Table.Column
                                key="detail"
                                title="Action"
                                dataIndex="detail"
                                render={(_, record) => (
                                    <Tooltip title="Đánh giá">
                                        <Button
                                            type="link"
                                            icon={<EyeOutlined />}
                                            onClick={() => handleDetailClick(record.id)}
                                        />
                                    </Tooltip>
                                )}
                            />
                        </Table>
                        <div className="mt-5 text-center">
                            <Pagination
                                simple
                                current={displayedPage}
                                onChange={handlePaginationChange}
                                total={total * 10}
                            />
                        </div>
                    </Card><br />
                </div>
            </div>
          </div>
  );
}
