import { DatePicker, Space, Form, Input, Modal, message } from "antd";
import { useAppDispatch } from "../../../app/hooks";
import { useState } from "react";
import { CensorRegistrationPeriodAPI } from "../../../apis/censor/registration-period/registration-period.api";
import {
  AddRegistrationPeriod,
  SetRegistrationPeriod,
} from "../../../app/reducers/registration-period/registration-period.reducer";
import "./index.css";
const ModalThem = (props) => {
  const { modalOpen, setModalOpen, category } = props;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [name, setName] = useState("");
  const [numberArticles, setNumberArticles] = useState(null);
  const { RangePicker } = DatePicker;
  const [submitLoading, setSubmitLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [check, setCheck] = useState(false);
  const [status, setStatus] = useState("");
  const [numArticles, setNumArticles] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  form.setFieldsValue(category);
  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [fromDate, toDate] = dates;
      setFromDate(fromDate.valueOf());
      setToDate(toDate.valueOf());
    } else {
      setFromDate(null); // Đặt giá trị ngày thành null nếu không có ngày được chọn
      setToDate(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
      form.setFieldsValue({ name: value }); // Cập nhật giá trị trong form
    } else if (name === "numberArticles") {
      setNumberArticles(value);
      form.setFieldsValue({ numberArticles: value }); // Cập nhật giá trị trong form
    }
  };

  const fetchData = () => {
    const data = {
      search: "",
      fromDate: new Date(null).getTime(),
      toDate: new Date(null).getTime(),
      status: "",
      numberArticles: null,
      page: 0,
    };
    CensorRegistrationPeriodAPI.fetchAll(data).then((response) => {
      dispatch(SetRegistrationPeriod(response.data.data.data));
      setCheck(true);
    });
  };

  const onFinish = () => {
    let isValid = true;
    setSubmitLoading(true);
    if (!name) {
      isValid = false;
      message.error("Tên đợt đăng kí không được trống");
    } else if (name.length < 6) {
      isValid = false;
      message.error("Tên đợt đăng ký tối thiểu 6 kí tự");
    } else if (/[!@#$%^&*()_+{}[\]:;<>,.?~\\/]/.test(name)) {
      isValid = false;
      message.error("Tên đợt đăng ký không được chứa kí tự đặc biệt");
    }

    if (!fromDate || !toDate) {
      isValid = false;
      message.error("Thời gian đợt đăng kí không được trống");
    }

    const parsedNumberArticles = parseFloat(numberArticles);
    if (!numberArticles) {
      isValid = false;
      message.error("Số lượng bài viết không được bỏ trống");
    } else if (isNaN(parsedNumberArticles)) {
      isValid = false;
      message.error("Số lượng bài viết phải là số");
    } else if (parsedNumberArticles <= 0) {
      isValid = false;
      message.error("Số lượng bài viết phải lớn hơn 0");
    }

    const data = {
      name: name,
      fromDate: fromDate,
      toDate: toDate,
      numberArticles: numberArticles,
    };
    if (isValid) {
      CensorRegistrationPeriodAPI.create(data)
        .then((result) => {
          fetchData();
          message.success("Thành công!");
          setModalOpen(false);
          form.setFieldValue(null);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            message.error(error.response.data.message);
          } else {
            message.error("Lỗi.");
          }
        })
        .finally(() => {
          setSubmitLoading(false); // Tắt trạng thái "loading" sau khi hoàn thành
        });
    }
  };
  const onFinishFailed = () => {
    message.error("Error, please reinform!!");
  };
  const onCancel = () => {
    setModalOpen(false);
    form.setFieldValue(null);
  };

  return (
    <>
      <Modal
        title="Tạo đợt đăng ký"
        open={modalOpen}
        onCancel={onCancel}
        footer={null}
      >
        <hr className="border-0 bg-gray-300 mt-3 mb-6" />
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            // maxWidth: 600,
            marginRight: "20px",
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item label="Tên">
            <Input name="name" value={name} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Thời gian" style={{ width: "100%" }}>
            <Space direction="vertical">
              {/* <DatePicker.RangePicker onChange={handleDateChange} /> */}
              <RangePicker
                style={{ height: "40px", width: "339px" }}
                renderExtraFooter={() => "Enter date"}
                onChange={handleDateChange}
              />
            </Space>
          </Form.Item>

          <Form.Item label="Số lượng bài viết">
            <Input
              name="numberArticles"
              value={numberArticles}
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <button onClick={onCancel} className="submit-button">
              Đóng
            </button>
            <button htmltype="submit" className="submit-button ml-2">
              Thêm
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalThem;
