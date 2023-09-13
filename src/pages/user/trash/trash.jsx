import { useEffect, useState } from "react";
import { Card, Row, Col, Dropdown, Menu, Pagination, message, Empty } from "antd";
import {
  DeleteOutlined,
  MoreOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ArticleTrashAPI } from "../../../apis/user/auth/trash/trash-article.api";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  GetArticles,
  SetArticles,
} from "../../../app/reducers/articles/articles.reducer";
import { useLocation, useNavigate } from "react-router-dom";

export default function Trash() {
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const displayedPage = current + 1;
  const navigate = useNavigate();
  const location = useLocation();
  const [hasData, setHasData] = useState(false);
  const [onlyOnePage, setOnlyOnePage] = useState(false);

  useEffect(() => {
    fetchAllArticleTrash();
  }, [current]);

  const fetchAllArticleTrash = async () => {
    try {
      const response = await ArticleTrashAPI.fetchAllArticleTrash({
        page: current,
      });
      dispatch(SetArticles(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setCurrent(current);
      const queryParams = new URLSearchParams();
      queryParams.set("page", current + 1);
      navigate(`${location.pathname}?${queryParams.toString()}`);
      if (response.data.data.data.length > 0) {
        setHasData(true);
      } else {
        setHasData(false);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };


  const handleRestoreClick = (id) => {
    ArticleTrashAPI.restore(id)
      .then((response) => {
        dispatch(SetArticles(response.data.data));
        message.success("Khôi phục thành công");
        fetchAllArticleTrash();
      })
      .catch((error) => {
        message.error("Khôi phục thất bại");
      });
  };

  const handleDeleteTrashClick = (id) => {
    ArticleTrashAPI.deleteTrash(id)
      .then((response) => {
        dispatch(SetArticles(response.data.data));
        message.success("Xóa vĩnh viễn thành công");
        fetchAllArticleTrash();
      })
      .catch((error) => {
        message.error("Xóa vĩnh viễn thất bại");
      });
  };

  const moreOption = (trashId) => (
    <Menu>
      <Menu.Item onClick={() => handleDeleteTrashClick(trashId)}>
        <DeleteOutlined className="mr-2" />
        Xóa vĩnh viễn
      </Menu.Item>
      <Menu.Item onClick={() => handleRestoreClick(trashId)}>
        <ReloadOutlined className="mr-2" />
        Khôi phục
      </Menu.Item>
    </Menu>
  );

  const handlePaginationChange = (page) => {
    setCurrent(page - 1);
  };

  const dataTrashs = useAppSelector(GetArticles);

  const groupTrashsByDate = (trashs) => {
    if (!Array.isArray(trashs)) {
      return {};
    }

    const groupedData = {};

    trashs.forEach((trash) => {
      const date = new Date(trash.browseDate).toLocaleDateString();

      if (groupedData[date]) {
        groupedData[date].push(trash);
      } else {
        groupedData[date] = [trash];
      }
    });

    return groupedData;
  };

  const groupedTrashs = groupTrashsByDate(dataTrashs);

  return (
    <div>
      {hasData ? (
        Object.keys(groupedTrashs).map((date) => (
          <Card key={date} className="card-group" title={date}>
            {groupedTrashs[date].length > 0 ? (
              groupedTrashs[date].map((trash, index) => (
                <div key={trash.id} className="trash-item">
                  <Row align="middle">
                    <Col span={20}>
                      <p className="title-trash">{trash.title}</p>
                    </Col>
                    <Col span={4}>
                      <div className="more-menu">
                        <Dropdown
                          overlay={moreOption(trash.id)}
                          trigger={["click"]}
                        >
                          <MoreOutlined />
                        </Dropdown>
                      </div>
                    </Col>
                  </Row>
                  {index < groupedTrashs[date].length - 1 && (
                    <hr className="divider" />
                  )}
                </div>
              ))
            ) : null}
          </Card>
        ))
      ) : (
        <Empty description="Không có dữ liệu" style={{position: "absolute", top: "50%", transform: "translateY(-50%)", left: "0", right: "0", zIndex: "0"}}/>
      )}
      {total > 1 && (
        <div className="mt-5 text-center">
          <Pagination
            simple
            current={displayedPage}
            onChange={handlePaginationChange}
            total={total * 10}
          />
        </div>
      )}
    </div>
  );
}