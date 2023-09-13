/* eslint-disable jsx-a11y/iframe-has-title */
import {
  Button,
  Pagination,
  Table,
  Card,
  Input,
  Tooltip,
  message,
  Select,
  Space,
  Form,
  Row,
  Col,
  Modal
} from "antd";
import {
  DownloadOutlined,
  FormOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { DownloadArticleAPI } from "../../../apis/censor/download/download.api";
import { Link } from "react-router-dom";
import SendArticle from "./SendArticle";
import { CensorAPI } from "../../../apis/censor/article/article.api";
import ViewEditorJodit from "./preview-article"

export default function DownloadArticle() {
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [lstUser, setLstUser] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [newSelectedRowKeys, setNewSelectedRowKeys] = useState([]);
  const [previewContent, setPreviewContent] = useState("");
  const [previewTitle, setPreviewTitle] = useState("")
  const [previewVisible, setPreviewVisible] = useState(false);
  const [cbbCategory, setCbbCategory] = useState([]);
  const [res, setCbbRes] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    DownloadArticleAPI.fetchLoadCbb().then((response) => {
      setCbbRes(response.data.data.Registration)
      setCbbCategory(response.data.data.cbbCategory)
    });
  }, [])

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);
  const fetchData = () => {
    DownloadArticleAPI.fetchAll({
      page: current - 1,
    }).then((response) => {
      setLstUser(response.data.data.data);
      setTotal(response.data.data.totalPages);
    });
  };
  const showPreview = (articleId, title) => {
    CensorAPI.detailApprovedArticle(articleId).then((response) => {
      setPreviewContent(response.data.data.content);
      setPreviewTitle(title);
    });
    setPreviewVisible(true);
  };

  const closePreview = () => {
    setPreviewVisible(false);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
    },
    {
      title: "Tiêu đề bài viết",
      dataIndex: "articleName",
    },
    {
      title: "Đánh giá bài viết",
      dataIndex: "articleContentApprove",
    },
    {
      title: "Thể loại",
      dataIndex: "categoryName",
    },
    {
      title: "Mã giảng viên",
      dataIndex: "userCode",
    },
    {
      title: "Tên giảng viên",
      dataIndex: "userName",
    },
    {
      title: "Tên đợt đăng ký",
      dataIndex: "registrationName",
    },
    {
      title: () => <div>Action</div>,
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Link to={`/censor/detail-download-article/${record.articleId}`}>
              <Button className="detail-button w-12">
                <FormOutlined className="icon" />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Xem nhanh">
            <Button className="detail-button w-12" onClick={() => showPreview(record.articleId, record.articleName)}><EyeOutlined className="icon" /></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setNewSelectedRowKeys(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const clearForm = () => {
    form.setFieldsValue({
      categoryId: '',
      codeUser: "",
      contentActivity: '',
      nameUser: '',
      registrationId: '',
      status: 3,
      titleArticle: ''
    });
    fetchData()
  }

  const handleDownloadAll = () => {
    if (newSelectedRowKeys.length === 0) {
      message.error("Bạn phải chọn một dòng");
    } else {
      DownloadArticleAPI.export(newSelectedRowKeys).then((response) => {
        setSelectedRowKeys([]);
        message.success("Tải về thành công !!!");
        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "documents.zip"; // Tên file tải về
        link.click();
        window.URL.revokeObjectURL(url);
      });
    }
  };

  const updateStatus = (status) => {
    DownloadArticleAPI.updateStatus(newSelectedRowKeys, { status: status }).then((response) => {
      if (response.data.data) {
        setSelectedRowKeys([]);
        message.success("Chuyển đổi trạng thái thành công");
        clearForm();
      } else {
        message.error("Lỗi hệ thống !!!");
      }
    })
  }
  
  const transferApprove = () => {
    if (newSelectedRowKeys.length === 0) {
      message.error("Bạn phải chọn một dòng");
    } else {
      Modal.confirm({
        title: "Xác nhận cập nhật",
        content: "Bạn có chắc chắn muốn chuyển trạng thái thành đã gửi không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk() {
          updateStatus(3)
        },
      });
    }
  };
  const transferSent = () => {
    if (newSelectedRowKeys.length === 0) {
      message.error("Bạn phải chọn một dòng");
    } else {
      Modal.confirm({
        title: "Xác nhận cập nhật",
        content: "Bạn có chắc chắn muốn chuyển trạng thái thành đã gửi không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk() {
          updateStatus(6)
        },
      });
    }
  };
  const transferUp = () => {
    if (newSelectedRowKeys.length === 0) {
      message.error("Bạn phải chọn một dòng");
    } else {
      Modal.confirm({
        title: "Xác nhận cập nhật",
        content: "Bạn có chắc chắn muốn chuyển trạng thái thành đã đăng không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk() {
          updateStatus(8)
        },
      });
    }
  };
  const transferDuplicate = () => {
    if (newSelectedRowKeys.length === 0) {
      message.error("Bạn phải chọn một dòng");
    } else {
      Modal.confirm({
        title: "Xác nhận cập nhật",
        content: "Bạn có chắc chắn muốn chuyển trạng thái thành bị trùng không?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk() {
          updateStatus(9)
        },
      });
    }
  };

  const onFinish = () => {
    const values = form.getFieldsValue();
    DownloadArticleAPI.fetchAll(values).then((response) => {
      setLstUser(response.data.data.data);
      setTotal(response.data.data.totalPages);
      setCurrent(1);
    });
  };
  return (
    <>
      <Card className="mb-2" id="cloudArticle">
      <h2 className="m-0 font-semibold">Tìm kiếm tài liệu lưu trữ</h2>
      <hr className="border-0 bg-gray-300 mt-3 mb-12" />
        <Form
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          layout="horizontal"
           onFinish={onFinish}
        >
          {/* Dòng 1 */}
          <Row className="justify-around">
            <Col lg={11}>
              <Form.Item name="titleArticle" label={<span className="font-medium">Tiêu đề bài viết</span>}>
                <Input placeholder="Tìm kiếm Tiêu đề bài viết..." />
              </Form.Item>
            </Col>
            <Col lg={11}>
              <Form.Item name="contentActivity" label={<span className="font-medium">Đánh giá bài viết</span>}>
                <Input placeholder="Tìm kiếm Đánh giá bài viết..." />
              </Form.Item>
            </Col>
          </Row>
          {/* Dòng 2 */}
          <Row className="justify-around">
            <Col lg={11}>
              <Form.Item name="codeUser" label={<span className="font-medium">Mã giảng viên</span>}>
                <Input placeholder="Tìm kiếm Mã giảng viên..." />
              </Form.Item>
            </Col>
            <Col lg={11}>
              <Form.Item name="nameUser" label={<span className="font-medium">Tên giảng viên</span>}>
                <Input placeholder="Tìm kiếm Tên giảng viên..." />
              </Form.Item>
            </Col>
          </Row>
          {/* Dòng 3 */}
          <Row className="justify-around">
            <Col lg={11}>
              <Form.Item name="registrationId" label={<span className="font-medium">Đợt đăng ký</span>}>
              <Select defaultValue="">
                <Select.Option key={1} value="">-- Chọn đợt đăng ký --</Select.Option>
                  {res.length !== 0 && res.map((el) => <Select.Option value={el.id} >{ el.name }</Select.Option>)}
              </Select>
              </Form.Item>
            </Col>
            <Col lg={11}>
              <Form.Item name="categoryId" label={<span className="font-medium">Thể loại bài viết</span>}>
                <Select defaultValue="">
                  <Select.Option value="">-- Chọn thể loại --</Select.Option>
                  {cbbCategory.length !== 0 && cbbCategory.map((el) => <Select.Option value={el.id} >{ el.name }</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row className="justify-around">
            <Col lg={11}>
              <Form.Item name="status" label={<span className="font-medium">Trạng thái bài viết</span>}>
              <Select defaultValue={3}>
                <Select.Option value={3}>Bài viết đã phê duyệt</Select.Option>
                <Select.Option value={6}>Bài viết đã gửi</Select.Option>
                <Select.Option value={8}>Bài viết đã đăng</Select.Option>
                <Select.Option value={9}>Bài viết bị trùng</Select.Option>
                {/* Các tùy chọn khác */}
              </Select>
              </Form.Item>
            </Col>
            <Col lg={11}></Col>
          </Row>
          <Row className="justify-center">
              <Button onClick={clearForm} type="primary m-2">Làm mới</Button><Button onClick={onFinish} type="primary m-2">Tìm kiếm</Button>
          </Row>
    </Form>
      </Card>
      <Card>
        <div>
          <Row className="flex justify-between items-center">
            <h2 className="m-0 font-semibold">Danh sách tài liệu lưu trữ</h2>
            <div>
              <Tooltip title="Tải tất cả bài viết">
                  <Button type="primary" className="mx-5" onClick={handleDownloadAll}>
                    <DownloadOutlined />
                    Tải bài viết
                  </Button>
                </Tooltip>
              <SendArticle />
              <Tooltip title="Chuyển sang trạng thái sang bài viết đã phê duyệt">
                  <Button type="primary" className="mx-5" onClick={transferApprove}>
                    <DownloadOutlined />
                    Đã phê duyệt
                  </Button>
                </Tooltip>
              <Tooltip title="Chuyển sang trạng thái sang bài viết đã gửi">
                  <Button type="primary" className="mx-5" onClick={transferSent}>
                    <DownloadOutlined />
                    Đã gửi
                  </Button>
                </Tooltip>
              <Tooltip title="Chuyển sang trạng thái sang bài viết đã đăng">
                  <Button type="primary" className="mx-5" onClick={transferUp}>
                    <DownloadOutlined />
                    Đã đăng
                  </Button>
              </Tooltip>
              <Tooltip title="Chuyển sang trạng thái sang bài viết bị trùng">
                  <Button type="primary" className="mx-5" onClick={transferDuplicate}>
                    <DownloadOutlined />
                    Bị trùng
                  </Button>
                </Tooltip>
            </div>
          </Row>

          <div className="mt-5">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={lstUser}
              pagination={false}
              rowKey="articleId"
            />
          </div>
          <div className="mt-5 text-center">
            <Pagination
              simple
              current={current}
              onChange={(value) => {
                setCurrent(value);
              }}
              total={total * 10}
            />
          </div>
        </div>
      </Card>
      <Modal
        title={previewTitle}
        visible={previewVisible}
        onCancel={closePreview}
        footer={null}
        width={1000}
      >
        <hr className="border-0 bg-gray-300 mt-3 mb-6" />
        <ViewEditorJodit value={previewContent}/>
      </Modal>
    </>
  );
}
