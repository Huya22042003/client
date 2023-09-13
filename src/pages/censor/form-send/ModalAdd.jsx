import { Form, Input, Modal, message, Checkbox } from "antd";
import { useAppDispatch } from "../../../app/hooks";
import { FormSendAPI } from "../../../apis/censor/form-send/form-send.api";
import { SetFormSend } from "../../../app/reducers/form-send/form-send.reducer";
import "./index.css";
import { CensorSendDataApi } from "../../../apis/censor/send-data/send-data.api";
const ModalThem = (props) => {
  const onFinishFailed = () => {
    message.error("Error");
  };
  const { modalOpen, setModalOpen, category, isSendArticle } = props;
  const [form] = Form.useForm();

  const fetchData = () => {
    const data = {
      title: "",
      fromDate: new Date(null).getTime(),
      toDate: new Date(null).getTime(),
      page: 0,
      status: "",
    };
    if (isSendArticle) {
      CensorSendDataApi.ferchUrlFormAll().then((response) => {
        dispatch(SetFormSend(response.data.data));
      });
    } else {
      FormSendAPI.fetchAll(data).then((response) => {
        dispatch(SetFormSend(response.data.data.data));
      });
    }
  };
  const dispatch = useAppDispatch();
  form.setFieldsValue(category);
  const onFinish = () => {
    form
      .validateFields()
      .then((formValues) => {
        if (category === null) {
          FormSendAPI.create(formValues)
            .then((result) => {
              fetchData();
              message.success("Thành công!");
              // dispatch(AddFormSend(result.data.data));
              setModalOpen(false);
              form.resetFields();
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
        } else {
          FormSendAPI.update(formValues, category.key)
            .then((response) => {
              fetchData();
              message.success("Thành công!");
              // dispatch(UpdateFormSend(response.data.data));
              setModalOpen(false);
              form.resetFields();
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
      })
      .catch(() => {
        message.error("Vui lòng điền đầy đủ thông tin.");
      });
  };

  const onCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Tạo mới form"
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
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
            status: "off",
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[
              {
                required: true,
                message: "Title không được để trống",
              },
              // {
              //   pattern:
              //     /^[a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸ#]*$/,
              //   message: "Tên bài viết không bao gồm các ký tự đặc biệt",
              // },
              {
                min: 4,
                message: "Tên bài viết phải tối thiểu 4 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Url"
            name="url"
            rules={[
              {
                required: true,
                message: "Url không được để trống",
              },
            ]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 20 }} />
          </Form.Item>
          <Form.Item name="status" valuePropName="checked"  style={{ marginLeft: 80 }}>
            <div style={{ textAlign: "center" }}>
              <Checkbox defaultChecked={form.getFieldValue("defaulted")}>
                Set mặc định
              </Checkbox>
            </div>
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
            <button htmlType="submit" className="submit-button ml-2">
              OK
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalThem;
