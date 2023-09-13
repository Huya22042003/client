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
  message,
  Modal,
  Checkbox,
  Input,
} from "antd";
import { Link } from "react-router-dom";
import Meta from "antd/es/card/Meta";
import {
  CommentOutlined,
  HeartFilled,
  HeartOutlined,
  LineOutlined,
  StarFilled,
  MoreOutlined,
  ArrowLeftOutlined,
  PlusSquareOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { TymAPI } from "../../../apis/user/auth/tym/tym.api";
import { getImageUrl } from "../../../AppConfig";
import { UserAlbumAPI } from "../../../apis/user/guest/album/user-album.api";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  GetArticlesAlbum,
  SetArticlesAlbum,
} from "../../../app/reducers/articles-album/articles-album.reducer";
import {
  connectStompClient,
  getStompClient,
} from "../../../apis/stomp-client/config";
import { SetCountNotification } from "../../../app/reducers/notification/count-notification.reducer";
import { idUser } from "../../../AppConfig";
const CardDemo = (props) => {
  // const {
  //   id,
  //   name,
  //   title,
  //   descriptive,
  //   hashtags,
  //   favorite,
  //   img,
  //   nameCategory,
  //   tym,
  //   urlImage,
  //   userId,
  // } = props.data;

  const [cardsData, setCardsData] = useState([]);
  const dispatch = useAppDispatch();
  const [showBackButton, setShowBackButton] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [articlesId, setArticlesId] = useState("");
  const [visible, setVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  useEffect(() => {
    setCardsData(props.data);
  }, [props.data]);
  useEffect(() => {
    connectStompClient();
  }, []);

  // realtime tym
  const stompClient = getStompClient();
  const connect = () => {
    stompClient.connect({}, () => {
      stompClient.subscribe(
        "/portal-articles/create-notification-user/" + idUser,
        function (message) {
          const data = JSON.parse(message.body).data;
          dispatch(SetCountNotification(data));
        }
      );
    });
  };
  useEffect(() => {
    if (stompClient != null) {
      connect();
    }

    return () => {
      if (stompClient != null) {
        getStompClient().disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stompClient]);

  //create album
  const fetchArticleAlbum = (id) => {
    UserAlbumAPI.findAllSimpleAllBumByUserId(id).then((response) => {
      dispatch(SetArticlesAlbum(response.data.data));
    });
  };

  const dataAlbum = useAppSelector(GetArticlesAlbum);

  useEffect(() => {
    const albumsWithArticles = dataAlbum.filter(
      (album) => album.countArticle > 0
    );
    const albumIdsWithArticles = albumsWithArticles.map((album) => album.id);
    setCheckedItems(albumIdsWithArticles);
  }, [dataAlbum]);

  const createArticleAlbum = (albumId) => {
    const data = {
      articlesId: articlesId,
      albumId: albumId,
    };
    return UserAlbumAPI.create(data)
      .then((response) => {
        const result = response.data;
        message.success("Đã thêm vào album");
        return result;
      })
      .catch((error) => {
        console.error("Error adding article:", error);
        throw error;
      });
  };

  const deleteArticleAlbum = (albumId) => {
    const data = {
      articleId: articlesId,
      albumId: albumId,
    };
    return UserAlbumAPI.delete(data)
      .then((response) => {
        const result = response.data;
        message.success("Đã xóa khỏi album");
        return result;
      })
      .catch((error) => {
        console.error("Error adding article:", error);
        throw error;
      });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const createAlbum = () => {
    const data = {
      title: title,
      status: status,
    };
    return UserAlbumAPI.createAlbum(data)
      .then((response) => {
        const result = response.data.data;
        createArticleAlbum(result.id);
        handleModalClose();
        return result;
      })
      .catch((error) => {
        console.error("Error adding article:", error);
        throw error;
      });
  };

  const handleCheckboxChange = (id) => {
    const isChecked = checkedItems.includes(id);

    if (isChecked) {
      setCheckedItems((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item !== id)
      );
      deleteArticleAlbum(id);
    } else {
      setCheckedItems((prevCheckedItems) => [...prevCheckedItems, id]);
      createArticleAlbum(id);
    }
  };

  const handleModalOpen = () => {
    setVisible(true);
  };

  const handleModalClose = () => {
    setVisible(false);
    setShowAdditionalFields(false);
    setTitle("");
    setStatus("");
    setShowBackButton(false);
  };

  const handleToggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
    setShowBackButton(!showBackButton);
  };

  const handleBack = () => {
    setShowAdditionalFields(false);
    setShowBackButton(false);
  };

  const handleCombinedClick = (id) => {
    fetchArticleAlbum(id);
    setArticlesId(id);
    handleModalOpen();
  };
  //end create album

  const handleLike = async (id) => {
    try {
      await TymAPI.createTymArticle({
        articlesId: id,
      });
      setCardsData((prevCardsData) =>
        prevCardsData.map((card) => {
          if (card.id === id) {
            const newFavoriteValue = card.favorite === 0 ? 1 : 0;
            const newTymValue =
              newFavoriteValue === 1 ? card.tym + 1 : card.tym;
            return { ...card, favorite: newFavoriteValue, tym: newTymValue };
          }
          return card;
        })
      );
      stompClient.send("/action/create-notification-user/" + idUser);
    } catch (error) {
      message.error("Lỗi");
    }
  };
  const handleUnlike = async (id) => {
    try {
      await TymAPI.deleteTymArticle(id);
      setCardsData((prevCardsData) =>
        prevCardsData.map((card) => {
          if (card.id === id) {
            const newFavoriteValue = card.favorite === 1 ? 0 : 1;
            const newTymValue =
              newFavoriteValue === 1 ? card.tym + 1 : card.tym - 1;
            return { ...card, favorite: newFavoriteValue, tym: newTymValue };
          }
          return card;
        })
      );
    } catch (error) {
      message.error("Lỗi");
    }
  };

  const UserInfoTooltip = ({ name, followCount, descriptive, img }) => (
    <div style={{ alignItems: "center", color: "#000" }}>
      <div className="flex">
        <Avatar src={img} />
        <p className="ml-3 mt-1 text-white-400" variant="subtitle1">
          {name}
        </p>
      </div>

      <p>My name is Hai, I am human, hihi, nice to meet you.</p>
      <hr />
      <Row>
        <Col span={12}>
          <p>Followers: 12</p>
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
            // key={card.id}
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
                        {moment(card.browseDate).format("DD/MM/YYYY")}
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
                      title={<span className="text-xl"> {card.title}</span>}
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
                                to={`/user/article/${card.id}`}
                              >
                                Xem thêm
                              </Link>
                            </div>

                            {/* Like share comment */}
                            <div className="flex mt-3 -ml-3.5 float-left">
                              <span className="flex items-center ml-4 text-base">
                                {card.favorite === 1 ? (
                                  <HeartFilled
                                    style={{ color: "red" }}
                                    onClick={() => handleUnlike(card.id)}
                                  />
                                ) : (
                                  <HeartOutlined
                                    onClick={() => handleLike(card.id)}
                                  />
                                )}
                                <span className="text-base ml-1">
                                  {card.tym}
                                </span>
                              </span>

                              <span className="flex items-center ml-4 text-base cursor-pointer">
                                <CommentOutlined className="hover:text-blue-500" />
                                <span className="text-base ml-1">
                                  {card.comment}
                                </span>
                              </span>
                              <span className="flex items-center ml-4 text-base cursor-pointer">
                                <Tooltip title="Thêm bài viết vào album">
                                  <FolderAddOutlined
                                    onClick={() => {
                                      handleCombinedClick(card.id);
                                    }}
                                    className="hover:text-blue-500"
                                  />
                                </Tooltip>
                              </span>
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
      <div>
        <Modal
          title="Tạo danh sách mới"
          visible={visible}
          onCancel={handleModalClose}
          footer={
            showBackButton
              ? [
                  <div className="flex items-center">
                    <span
                      className="flex items-center text-base cursor-pointer"
                      onClick={handleBack}
                    >
                      <ArrowLeftOutlined className="mr-2" />
                    </span>
                    <Button
                      style={{ borderRadius: "20px" }}
                      onClick={createAlbum}
                      className="hover:bg-blue-50 ml-auto"
                    >
                      Tạo
                    </Button>
                  </div>,
                ]
              : [
                  <span
                    className="flex items-center text-base cursor-pointer"
                    onClick={handleToggleAdditionalFields}
                  >
                    <PlusSquareOutlined className="mr-2" />
                    Tạo album mới
                  </span>,
                ]
          }
        >
          {dataAlbum.map((album) => (
            <>
              <Checkbox
                onChange={() => handleCheckboxChange(album.id)}
                checked={checkedItems.includes(album.id)}
                key={album.id}
                value={album.id}
              >
                {album.title}
              </Checkbox>
              <br></br>
            </>
          ))}

          {showAdditionalFields && (
            <>
              <label style={{ display: "block", marginTop: "10px" }}>Tên</label>
              <Input
                value={title}
                onChange={handleTitleChange}
                style={{ border: "none", borderBottom: "1px solid #000" }}
                placeholder="Nhập tên album"
                key="inputField"
              />
              {/* <label style={{ display: "block", marginTop: "10px" }}>
                Quyền riêng tư
              </label>
              <Select
                value={status}
                onChange={handleStatusChange}
                style={{ width: "100%", marginTop: 10 }}
                placeholder="Chọn một giá trị"
                key="selectField"
              >
                <Option value="true">
                  <span className="flex items-center text-base cursor-pointer">
                    <GlobalOutlined className="mr-2" />
                    Public
                  </span>
                </Option>
                <Option value="false">
                  <span className="flex items-center text-base cursor-pointer">
                    <LockOutlined className="mr-2" />
                    Private
                  </span>
                </Option>
              </Select> */}
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CardDemo;
