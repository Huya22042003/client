import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
  Image,
  Modal,
  Checkbox,
  Select,
  Input,
  message,
} from "antd";
import Link from "antd/es/typography/Link";
import Meta from "antd/es/card/Meta";
import {
  BookOutlined,
  HeartFilled,
  HeartOutlined,
  LineOutlined,
  MinusCircleOutlined,
  ShareAltOutlined,
  StarFilled,
  MoreOutlined,
  PlusSquareOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { UserAlbumAPI } from "../../../../apis/user/guest/album/user-album.api";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  GetArticlesAlbum,
  SetArticlesAlbum,
} from "../../../../app/reducers/articles-album/articles-album.reducer";

const { Option } = Select;

const CardGuestList = (props) => {
  const dispatch = useAppDispatch();
  const [visible, setVisible] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [articlesId, setArticlesId] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);

  const fetchArticleAlbum = (id) => {
    UserAlbumAPI.findAllSimpleAllBumByUserId(id).then((response) => {
      dispatch(SetArticlesAlbum(response.data.data));
    });
  };

  useEffect(() => {
    fetchArticleAlbum();
  }, []);

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
        message.success("Create successfully!");
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
        message.success("Delete successfully!");
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

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const createAlbum = () => {
    const data = {
      title: title,
      status: status,
    };
    return UserAlbumAPI.createAlbum(data)
      .then((response) => {
        const result = response.data;
        message.success("Create album successfully!");
        window.location.reload();
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

  useEffect(() => {
    if (props.data != null && props.data.length > 0) setCardsData(props.data);
  }, [props.data]);

  const [cardsData, setCardsData] = useState([]);
  const handleLike = (id) => {
    setCardsData((prevCardsData) =>
      prevCardsData.map((card) =>
        card.id === id ? { ...card, isLiked: !card.isLiked } : card
      )
    );
  };

  const handleCombinedClick = (id) => {
    fetchArticleAlbum(id);
    setArticlesId(id);
    handleModalOpen();
  };

  const [current, setCurrent] = useState("");

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const items = (
    <Menu onClick={onClick} selectedKeys={[current]}>
      <Menu.Item key="setting:1">Option 1</Menu.Item>
      <Menu.Item key="setting:2">Option 2</Menu.Item>
    </Menu>
  );
  const onVisibleChange = (visible) => {
    if (!visible) {
      setCurrent(null);
    }
  };
  const UserInfoTooltip = ({ name, followCount, description, img }) => (
    <div style={{ alignItems: "center", color: "#000" }}>
      <div className="flex">
        <Avatar src={img} />
        <p className="ml-3 mt-1 text-white-400" variant="subtitle1">
          {name}
        </p>
      </div>

      <p>{description}</p>
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
    <div>
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
                          <LineOutlined
                            style={{ transform: "rotate(90deg)" }}
                          />
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
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {/* HashTag */}
                              <Space
                                size={[0, 8]}
                                wrap
                                className="float-left mt-3"
                              >
                                {card.hashtags != null &&
                                  card.hashtags.split(", ").map((el) => (
                                    <Tag
                                      bordered={false}
                                      className="rounded-lg"
                                    >
                                      <Link href={`/articel?hashtag=`}>
                                        {el}
                                      </Link>
                                    </Tag>
                                  ))}
                              </Space>

                              {/* Description */}
                              <div className="flex items-center">
                                <p
                                  className="w-4/5"
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {card.descriptive}
                                </p>{" "}
                                <Link
                                  className="w-1/5"
                                  href={`/article/${card.id}`}
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
                        src={card.urlImage}
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          ))}
        </div>
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
                      Create
                    </Button>
                  </div>,
                ]
              : [
                  <span
                    className="flex items-center text-base cursor-pointer"
                    onClick={handleToggleAdditionalFields}
                  >
                    <PlusSquareOutlined className="mr-2" />
                    Create albums
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
              <label style={{ display: "block", marginTop: "10px" }}>
                Name
              </label>
              <Input
                value={title}
                onChange={handleTitleChange}
                style={{ border: "none", borderBottom: "1px solid #000" }}
                placeholder="Enter album name"
                key="inputField"
              />
              <label style={{ display: "block", marginTop: "10px" }}>
                Privacy
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
              </Select>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CardGuestList;
