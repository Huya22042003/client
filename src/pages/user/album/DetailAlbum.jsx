import {
  AuditOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined
} from "@ant-design/icons";
import { Card, Col, Dropdown, Empty, Image, Menu, Modal, Row, Space, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import anh1 from "../../../assets/images/face-3.jpg";
import "./index.css";
import { useParams, useNavigate } from 'react-router-dom';
import { AlbumAPI } from "../../../apis/user/guest/album/user.album.api";

export default function DetailAlbum() {
  const [articles, setArticles] = useState([]);
  const [album, setAlbum] = useState({});
  const { id } = useParams();
  const [articleId, setArticleId] = useState(null);
  const navigate = useNavigate();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [albumHasArticles, setAlbumHasArticles] = useState(false);

  const getAllArticlesByAlbum = () => {
    AlbumAPI.fetchAllArticleByAlbum(id).then((response) => {
      setArticles(response.data.data.data);
      if (response.data.data.data.length === 0) {
        setAlbumHasArticles(false);
      } else {
        setAlbumHasArticles(true);
      }
    })
  }

  const getAlbumById = () => {
    AlbumAPI.fetchAlbumById(id).then((response) => {
      setAlbum(response.data.data);
    });
  }

  useEffect(() => {
    getAllArticlesByAlbum();
    getAlbumById();
  }, []);

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleDropdownMore = (e) => {
    setArticleId(e.key);
  };

  const moreOption = (
    <Menu onClick={handleDropdownMore}>
      <Menu.Item key={articleId} onClick={() => deleteArticle()}>
        <DeleteOutlined className="mr-2" />
        Xóa khỏi album
      </Menu.Item>
    </Menu>
  );

  const setIdBaiViet = (id) => {
    setArticleId(id);
  }

  const deleteArticle = () => {
    AlbumAPI.deleteArticleOnAlbum(articleId, id).then(() => {
      getAllArticlesByAlbum();
      message.success("Xóa bài viết khỏi album thành công");
    })
      .catch((error) => {
        message.error("Xóa bài viết khỏi album thất bại");
      })
  }

  const handleClickArticle = (id) => {
    navigate(`/user/article/${id}`);
  }

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteAlbum = (id) => {
    showDeleteModal();
  };

  const confirmDeleteAlbum = (id) => {
    AlbumAPI.deleteAlbum(id)
      .then(() => {
        setIsDeleteModalVisible(false);
        navigate("/user/album");
        message.success("Xóa album thành công!");
      })
      .catch((error) => {
        message.error("Xóa album thất bại");
      });
  };

  const cancelDeleteAlbum = () => {
    setIsDeleteModalVisible(false);
  };



  return (
    <div id="album">
      <div>
        <Row>
          <Col xs={8} className="mr-6">
            <Card
              className="ablum-filter"
              hoverable
              style={{
                width: "auto",
                overflow: "hidden",
                background: `url(${anh1})`
              }}
            >
              <div style={{}}>
                <Image
                  src={album.userImg}
                  style={{
                    width: "auto",
                    borderRadius: "10px",
                  }}
                ></Image>
                <div className="pt-3 justify-between">
                  <Row>
                    <Col xs={22}>
                      <span className="text-3xl font-black">
                        {album.title}
                      </span>
                    </Col>
                    <Col xs={2} className="pt-2" style={{ fontSize: "20px" }}>
                    </Col>
                  </Row>
                  <Row className="pt-3">
                    <span className="text-xl">
                      <AuditOutlined className="mr-2" />
                      {album.userName}
                    </span>
                  </Row>
                  <Row className="pt-3">
                    <span className="text-base">{album.numberOfArticle} bài viết</span>
                    <span className="text-base ml-3">
                      <CalendarOutlined className="mr-1" />
                      {formatDate(album.creatAt)}
                    </span>
                  </Row>
                  <Row className="pt-3">
                    <Col xs={22}>
                      <span className="text-base">
                        Không có thông tin mô tả
                      </span>
                    </Col>
                    <Col xs={2} className="pt-2" style={{ fontSize: "15px" }}>
                      <Tooltip title={"Xóa album"}>
                        <DeleteOutlined onClick={() => handleDeleteAlbum(album.id)} className="float-right" />
                      </Tooltip>
                    </Col>
                  </Row>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={15}>
            {albumHasArticles ? (
              <div className="article-list">
                {articles.map((a) => (
                  <Card className="mb-4">
                    <Row>
                      <Col span={23}>
                        <div className="ml-1">
                          <Row className="justify-between">
                            <Col span={6}>
                              <Image
                                alt="example"
                                src={a.img}
                                style={{
                                  width: "320px",
                                  height: "100px",
                                  borderRadius: "5px",
                                }}
                              />
                            </Col>
                            <Col span={17}>
                              <span className="text-lg font-semibold" onClick={() => handleClickArticle(a.id)}>
                                {a.title.length > 100 ? `${a.title.substring(0, 100)} ...` : a.title}
                              </span>
                              <Row>
                                <span className="text-lg">{a.name}</span>
                              </Row>
                              <div className="-mt-5">
                                <span className="text-5xl text-slate-900 font-normal mr-1">
                                  .
                                </span>
                                <span>{formatDate(a.browseDate)}</span>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col span={1}>
                        <Dropdown overlay={moreOption} onClick={() => setIdBaiViet(a.id)} trigger={["click"]}>
                          <Space className="text-base">
                            <MoreOutlined />
                          </Space>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty description={"Không có bài viết"} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "0", right: "0", zIndex: "0" }} />
            )}
          </Col>
        </Row>
        <Modal
          title="Xác nhận xóa album"
          visible={isDeleteModalVisible}
          onOk={() => confirmDeleteAlbum(id)}
          onCancel={cancelDeleteAlbum}
          okText="Xác nhận"
          okType="danger"
          cancelText="Hủy"
        >
          Khi xóa album sẽ xóa luôn tất cả bài viết bạn đã thêm vào album đó. <br />
          Bạn có chắc chắn muốn xóa album này?
        </Modal>
      </div>
    </div>
  );
};

