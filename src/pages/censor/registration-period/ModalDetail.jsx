import { DatePicker, Space, Form, Input, Modal, message, Select } from "antd";
import { useAppDispatch } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { CensorRegistrationPeriodAPI } from "../../../apis/censor/registration-period/registration-period.api";
// import { UpdateRegistrationPeriod } from "../../../app/reducers/registration-period/registration-period.reducer";
import moment from "moment";
const ModalDetail = (props) => {
  console.log(props);
  const { category } = props;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [fromDate, setFromDate] = useState(category.fromDate);
  const [toDate, setToDate] = useState(category.toDate);
  const { Option } = Select;
  const [modalOpen, setModalOpen] = useState(true);
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        code: category.code,
        name: category.name,
        numberArticles: category.numberArticles,
        status: category.status,
      });
    }
  }, [category, form]);

  const handleDateChange = (dates) => {
    const [fromDate, toDate] = dates;
    setFromDate(fromDate.valueOf());
    setToDate(toDate.valueOf());
  };

  const onFinish = () => {
    var formData = form.getFieldValue();
    let isValid = true;

    if (!formData.name) {
      isValid = false;
      message.error("Tên đợt đăng kí không được trống!!");
    }

    if (!fromDate || !toDate) {
      isValid = false;
      message.error("Thời gian đợt đăng kí không được trống!!");
    }

    const parsedNumberArticles = parseFloat(formData.numberArticles);
    if (isNaN(parsedNumberArticles) || parsedNumberArticles <= 0) {
      isValid = false;
      message.error("Số lượng bài viết phải lớn hơn 0!!");
    }
    const data = {
      name: formData.name,
      fromDate: fromDate,
      toDate: toDate,
      numberArticles: parseFloat(formData.numberArticles),
      status: formData.status,
    };

    if (isValid) {
      CensorRegistrationPeriodAPI.update(data, category.id).then(
        (response) => {
          // dispatch(UpdateRegistrationPeriod(response.data.data));
          message.success("Success!");
          setModalOpen(false);
        },
        (err) => {
          message.error("Error", err);
        }
      );
    }
  };
  const onFinishFailed = () => {
    message.error("Error, please reinform!!");
  };
  const onCancel = () => {
    console.log("aaaaa");
    setModalOpen(false);
    console.log(modalOpen);
  };
  const validateNumberArticles = (rule, value, callback) => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      callback("Số lượng bài viết phải là số lợp lệ lớn hơn 0");
    } else {
      callback();
    }
  };
  const getDate = () => {
    const date = {
      fromDate: category.fromDate,
      toDate: category.toDate,
    };
    const fromDateMoment = moment(date.fromDate);
    const toDateMoment = moment(date.toDate);
    return [fromDateMoment, toDateMoment];
  };

  return (
    <>
      <Modal
        title="Cập nhập đợt đăng ký"
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
            marginRight: "20px",
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item label="Mã" name="code">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên đợt đăng kí không được trống!!",
              },
              {
                min: 6,
                message: "Tên đợt đăng ký tối thiểu 6 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Thời gian">
            <Space
              direction="vertical"
              style={{
                width: "100%",
              }}
            >
              <DatePicker.RangePicker
                status="warning"
                style={{
                  width: "100%",
                }}
                value={getDate}
                onChange={handleDateChange}
              />
            </Space>
          </Form.Item>

          <Form.Item
            label="Số lượng bài viết"
            name="numberArticles"
            rules={[
              {
                required: true,
                message: "Số lượng bài viết không được trống",
              },
              {
                validator: validateNumberArticles,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              <Option value="status" disabled>
                Select status
              </Option>
              <Option value="0">Hoạt động</Option>
              <Option value="1">Không hoạt động</Option>
            </Select>
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
              OK
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalDetail;
