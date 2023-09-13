import {
  Select,
  Button,
  Card,
  Form,
  Input,
  Space,
  DatePicker,
  message,
  Modal,
} from "antd";
import React from "react";
import TableRegistration from "./TableDetail";
import ModalRegistration from "./ModalRegistration";
import { useEffect, useState } from "react";
import { CensorRegistrationUserAPI } from "../../../../apis/censor/registration-user/registration-user.api";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  GetRegistrationPeriod,
  SetRegistrationPeriod,
} from "../../../../app/reducers/registration-period/registration-period.reducer";
import dayjs from "dayjs";
import { CensorRegistrationPeriodAPI } from "../../../../apis/censor/registration-period/registration-period.api";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "../index.css";
dayjs.extend(customParseFormat);

export default function DetailRegistration() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const fetchData = async () => {
    try {
      const response = await CensorRegistrationUserAPI.fetchAll({}, id);
      const responseData = response.data.data;

      let dem = 0;
      responseData.censorUserInRegistrationReponses.forEach((el) => {
        dem = dem + el.numberArticles;
      });

      const updatedRegistrationPeriod = {
        ...responseData.registrationPeriod,
        restNumber: dem,
      };

      dispatch(SetRegistrationPeriod(updatedRegistrationPeriod));
    } catch (error) {
      Modal.error({
        title: "Thông báo",
        content: "Lỗi hệ thống",
        okText: "Đồng ý",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, id]);

  const registrationPeriod = useAppSelector(GetRegistrationPeriod);
  const [fromDateNew, setFromDateNew] = useState(null);
  const [toDateNew, setToDateNew] = useState(null);
  useEffect(() => {
    const a = registrationPeriod.fromDate;
    const b = registrationPeriod.toDate;
    setFromDateNew(a);
    setToDateNew(b);
  }, [registrationPeriod]);
  useEffect(() => {
    const initialValues = {
      code: registrationPeriod.code,
      name: registrationPeriod.name,
      numberArticles: registrationPeriod.numberArticles,
      status:
        registrationPeriod.registrationPeriodStatus === "INACTIVE" ? "1" : "0",
    };
    form.setFieldsValue(initialValues);
  }, [form, registrationPeriod]);

  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const [fromDate, toDate] = dates;
      setFromDateNew(fromDate ? fromDate.valueOf() : null);
      setToDateNew(toDate ? toDate.valueOf() : null);
    } else {
      setFromDateNew(undefined);
      setToDateNew(undefined);
    }
  };

  const validateNumberArticles = (rule, value) => {
    return new Promise((resolve, reject) => {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue) || parsedValue <= 0) {
        reject("Số lượng bài viết phải là số lợp lệ lớn hơn 0");
      } else {
        resolve();
      }
    });
  };

  const onFinish = () => {
    var formData = form.getFieldValue();
    let isValid = true;

    if (!formData.name.trim()) {
      isValid = false;
      message.error("Tên đợt đăng kí không được trống");
    } else if (formData.name.length < 6) {
      isValid = false;
      message.error("Tên đợt đăng ký tối thiểu 6 kí tự");
    } else if (/[!@#$%^&*()_+{}[\]:;<>,.?~\\/]/.test(formData.name)) {
      isValid = false;
      message.error("Tên đợt đăng ký không được chứa kí tự đặc biệt");
    }

    if (!fromDateNew || !toDateNew) {
      isValid = false;
      message.error("Thời gian đợt đăng kí không được trống");
    }

    const parsedNumberArticles = parseFloat(formData.numberArticles);
    if (!formData.numberArticles) {
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
      name: formData.name,
      numberArticles: parseFloat(formData.numberArticles),
      status: formData.status,
      fromDate: fromDateNew,
      toDate: toDateNew,
    };

    if (isValid) {
      CensorRegistrationPeriodAPI.update(data, id)
        .then((response) => {
          fetchData();
          message.success("Thành công!");
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
        });
    }
  };

  const onFinishFailed = () => {
    message.error("Error, please reinform!!");
  };
  const handleButtonCloseClick = () => {
    CensorRegistrationPeriodAPI.close({}, id)
      .then((response) => {
        fetchData();
        message.success("Thành công!");
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
      });
  };

  return (
    <>
      {showModal && (
        <ModalRegistration
          modalOpen={showModal}
          setModalOpen={setShowModal}
          width={1200}
          id={id}
          numberAll={
            registrationPeriod.numberArticles - registrationPeriod.restNumber
          }
        />
      )}

      <Card className="px-10 pt-5">
        <h1
          style={{ fontSize: "22px", marginTop: "-20px", textAlign: "center" }}
        >
          ĐỢT ĐĂNG KÝ:{" "}
          {registrationPeriod.name ? registrationPeriod.name.toUpperCase() : ""}
        </h1>
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelAlign="left"
          form={form}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <Form.Item label="Mã đợt đăng ký" name="code">
                <Input
                  readOnly
                  style={{
                    marginLeft: "10px",
                    width: "300px",
                    fontWeight: "bold",
                  }}
                />
              </Form.Item>
              <Form.Item label="Tên đợt đăng ký" name="name">
                <Input style={{ marginLeft: "10px", width: "300px" }} />
              </Form.Item>

              <Form.Item label="Thời gian">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <RangePicker
                    style={{ marginLeft: "50px", width: "300px" }}
                    value={[dayjs(fromDateNew), dayjs(toDateNew)]}
                    renderExtraFooter={() => "Enter date"}
                    onChange={handleDateChange}
                  />
                </Space>
              </Form.Item>
              <Form.Item label="Status" name="status">
                <Select style={{ marginLeft: "70px", width: "300px" }}>
                  <Option value="status" disabled>
                    Select status
                  </Option>
                  <Option value="0">Hoạt động</Option>
                  <Option value="1">Không hoạt động</Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Số lượng bài viết quy định trong kỳ"
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
                <Input style={{ marginLeft: "30px" }} />
              </Form.Item>
              <Form.Item label="Số lượng bài viết số lượng bài viết đã giao">
                <label style={{ paddingLeft: "25px" }}>
                  {registrationPeriod.restNumber} Bài
                </label>
              </Form.Item>
              <Form.Item label="Số lượng bài viết số lượng bài viết chưa giao">
                <label style={{ paddingLeft: "10px" }}>
                  {registrationPeriod.numberArticles -
                    registrationPeriod.restNumber}{" "}
                  Bài
                </label>
              </Form.Item>
            </div>
          </div>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
            style={{ marginLeft: -140 }}
          >
            <Button
              style={{
                color: "#fff",
                borderRadius: "5px",
              }}
              className="bg-green-500 hover:bg-green-400  hover:border-green-400 mx-5"
            >
              Import excel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Thêm giảng viên vào đợt
            </Button>
            <Button
              style={{
                color: "#fff",
                borderRadius: "5px",
              }}
              className={`bg-orange-400 hover:bg-orange-400 hover:border-orange-400 mx-5 ${
                registrationPeriod.registrationPeriodStatus === "INACTIVE"
                  ? "disabled"
                  : ""
              }`}
              htmlType="button"
              onClick={() => {
                if (
                  registrationPeriod.registrationPeriodStatus !== "INACTIVE"
                ) {
                  onFinish();
                }
              }}
              // disabled={
              //   registrationPeriod.registrationPeriodStatus === "INACTIVE"
              // }
            >
              Cập nhật đợt
            </Button>
            <Button
              style={{
                color: "#fff",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              className={`bg-red-500 hover:bg-red-400 hover:border-red-400 mx-5 ${
                registrationPeriod.registrationPeriodStatus === "INACTIVE"
                  ? "disabled"
                  : ""
              }`}
              htmlType="button"
              onClick={() => {
                if (
                  registrationPeriod.registrationPeriodStatus !== "INACTIVE"
                ) {
                  handleButtonCloseClick();
                }
              }}
            >
              Đóng đợt
            </Button>
            <Button
              style={{
                color: "#fff",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
              className="bg-red-500 hover:bg-red-400  hover:border-red-400 mx-5"
            >
              <Link type="link" to={`/censor/registration-period`}>
                Quay lại
              </Link>
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card className="mt-12">
        <TableRegistration
          numberAll={
            registrationPeriod.numberArticles - registrationPeriod.restNumber
          }
        />
      </Card>
    </>
  );
}
