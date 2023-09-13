import React from "react";
import anh1 from "../../../assets/images/home-decor-1.jpeg";
import {
  Avatar,
  Col,
  Row,
  Typography,
  Tooltip,
  Modal,
  message,
  Card,
} from "antd";
import {
  EditOutlined,
  CommentOutlined,
  HeartOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import JoditEditor from "jodit-react";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import { MyArticleAPI } from "../../../apis/user/auth/article/my-article.api";
import { DeleteArticles } from "../../../app/reducers/articles/articles.reducer";
import { useAppDispatch } from "../../../app/hooks";
const CardDetailArticles = (props) => {
  const [cardsData, setCardsData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setCardsData(props.data);
  }, [props.data]);

  const handleViewUpdateClick = () => {
    navigate(`/user/my-article/update/${id}`);
  };
  const handleDeleteClick = () => {
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    MyArticleAPI.delete(id).then((result) => {
      dispatch(DeleteArticles(result.data.data));
    });
    message.success("Xóa bài viết thành công");
    navigate(`/user/my-article`);
    setIsModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <Card>
      <div className="justify-items-center bg-white rounded-md">
        <Row>
          <Col span={24}>
            <div className="flex ">
              {cardsData.nameCategory ? (
                <Typography className="category1" variant="subtitle1">
                  {cardsData.nameCategory}
                </Typography>
              ) : null}

              <Typography
                variant="subtitle1"
                className="category2"
                style={{ marginLeft: "10px" }}
              >
                {/* Đợt đăng bài: */}
                {cardsData.namePeriod}
              </Typography>
            </div>
            <h1 className="text-5xl text-slate-900 font-bold not-italic mb-8 ">
              {cardsData.title}
            </h1>
            <div className="flex justify-between">
              <div className="flex">
                <Avatar src={anh1} style={{ width: "48px", height: "48px" }} />
                <div className="ml-3">
                  <div className="flex">
                    <Typography variant="subtitle1" className="name1">
                      {cardsData.name}
                    </Typography>
                  </div>
                  <span>
                    {moment(cardsData.browseDate).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex ">
                <div className="flex">
                  <span className="flex items-center ml-4 text-base">
                    <HeartOutlined />
                    <span className="text-base ml-1">{cardsData.tym}</span>
                  </span>
                  <span className="flex items-center ml-4 text-base">
                    <CommentOutlined className="hover:text-blue-500" />
                    <span className="text-base ml-1">
                      {cardsData.numberComments}
                    </span>
                  </span>
                </div>
                <div className="flex">
                  <span
                    className=" flex items-center ml-4 text-base"
                    onClick={handleViewUpdateClick}
                  >
                    <Tooltip title="Cập nhập">
                      <EditOutlined className="hover:text-blue-500" />
                    </Tooltip>
                  </span>
                  <div>
                    {/* Biểu tượng xóa với Tooltip */}
                    <span
                      className=" flex items-center ml-4 text-base mt-4"
                      onClick={handleDeleteClick}
                    >
                      <Tooltip title="Xóa">
                        <DeleteOutlined className="hover:text-red-500" />
                      </Tooltip>
                    </span>

                    {/* Modal Xác nhận xóa */}
                    <Modal
                      title="Xác nhận xóa"
                      visible={isModalVisible}
                      onOk={handleDeleteConfirm}
                      onCancel={handleDeleteCancel}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <JoditEditor
                value={cardsData.content}
                tabIndex={-1}
                config={{
                  readonly: true,
                  toolbar: false,
                  showCharsCounter: false,
                  showWordsCounter: false,
                  showStatusbar: true,
                  showPoweredBy: false,
                  className: "view_editor_jodit",
                  style: {
                    backgroundColor: "white",
                    border: "none",
                  },
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default CardDetailArticles;
