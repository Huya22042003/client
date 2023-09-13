import { useEffect, useState } from "react";

import {
  Card,
  Col,
  Row,
  Image,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Empty,
} from "antd";
import "./album.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  AddAlbum,
  GetAlbum,
  SetAlbum,
} from "../../../app/reducers/album/album.reducer";
import { AlbumAPI } from "../../../apis/user/guest/album/user.album.api";

export default function Album() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(false);
  const [hasData, setHasData] = useState(false);

  const getAllAlbum = () => {
    AlbumAPI.fetchAllAlbum().then((response) => {
      dispatch(SetAlbum(response.data.data));
      if(response.data.data.length > 0) {
        setHasData(true);
      }else{
        setHasData(false);
      }
    });
  };

  const dataAlbum = useAppSelector(GetAlbum);

  useEffect(() => {
    getAllAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleClickAlbum = (id) => {
    navigate(`/user/album/${id}`);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleSubmit = (values) => {
    const data = {
      title: values.title,
      status: values.status,
    };
    addAlbum(data);
    setShowModal(false);
  };

  const addAlbum = async (data) => {
    try {
      const response = await AlbumAPI.addAlbum(data);
      dispatch(AddAlbum(response.data));
    } catch (error) {
      console.error("Error adding album:", error);
    }
    getAllAlbum();
  };

  return (
    <div>
      <div className="flex flex-row-reverse">
        <Button onClick={handleOpenModal} type="primary" className="btn-add">
          Tạp mới album
        </Button>
      </div>
      {hasData ? (
        <>
      {dataAlbum.map((a) => (
        <Card className="mb-4" onClick={() => handleClickAlbum(a.id)}>
          <Row>
            <Col span={2} className="col-anh">
              <Image
                alt="example"
                src={a.userImg}
                style={{
                  width: "320px",
                  height: "100px",
                  borderRadius: "5px",
                }}
              />
            </Col>
            <Col span={20}>
              <span className="title">{a.title}</span>
              <Row>
                <span className="text-lg">{a.userName}</span>
              </Row>
              <div className="-mt-5">
                <span className="text-5xl text-slate-900 font-normal mr-1">
                  .
                </span>
                <span>{formatDate(a.creatAt)}</span>
              </div>
            </Col>
          </Row>
        </Card>
      ))}
        </>
      ) : (
        <Empty description={"Không có album"}
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
      {showModal && (
        <Modal 
          title="Tạo mới album"
          open={showModal}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form onFinish={handleSubmit}>
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tiêu đề",
                },
                {
                  pattern:
                    /^[a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/,
                  message: "Tiêu đề không được có các kí tự đặc biệt",
                },
                {
                  min: 6,
                  message: "Tiêu đề không được nhỏ hơn 6 kí tự",
                },
                {
                  max: 250,
                  message: "Tiêu đề không được nhiều hơn 250 kí tự",
                },
              ]}
            >
              <Input
                value={title}
                onChange={handleTitleChange}
                className="input"
              />
            </Form.Item>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Bạn cần phải chọn 1 trạng thái cho album",
                },
              ]}
            >
              <Select value={status} onChange={handleStatusChange}>
                <Select.Option value={false}>Công khai</Select.Option>
                <Select.Option value={true}>Riêng tư</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 9,
                span: 24,
              }}
            >
              <Button
                key="cancel"
                onClick={handleCloseModal}
                className="submit-button"
              >
                Đóng
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                className="submit-button ml-2"
              >
                Tạo mới
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
