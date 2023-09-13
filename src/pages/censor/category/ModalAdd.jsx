import { Form, Input, Modal, message } from "antd";
import { useAppDispatch } from "../../../app/hooks";
import { CategoryAPI } from "../../../apis/censor/category/category.api";
import { SetCategory } from "../../../app/reducers/category/category.reducer";
import "./index.css";
const ModalThem = (props) => {
  const onFinishFailed = () => {
    message.error("Error");
  };
  const { modalOpen, setModalOpen, category, isSendArticle } = props;
  const [form] = Form.useForm();

  form.setFieldsValue(category);

  const fetchData = () => {
    CategoryAPI.fetchAll().then((response) => {
      dispatch(SetCategory(response.data.data.data));
    });
  };

  const dispatch = useAppDispatch();
  form.setFieldsValue(category);
  const onFinish = () => {
    form
      .validateFields()
      .then((formValues) => {
        if (category === null) {
          CategoryAPI.create(formValues)
            .then((result) => {
              fetchData();
              message.success("Thành công!");
              if (isSendArticle) {
                props.onSave(result.data.data);
              }
              setModalOpen(false);
              form.resetFields();
            })
            .catch((err) => {
              message.error("Lỗi: " + err.message);
            });
        } else {
          CategoryAPI.update(formValues, category.id)
            .then((response) => {
              fetchData();
              message.success("Thành công!");
              if (isSendArticle) {
                props.onSave(response.data.data);
              }
              setModalOpen(false);
              form.resetFields();
            })
            .catch((err) => {
              message.error("Lỗi: " + err.message);
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
        title="Thể loại bài viết"
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
          }}
          autoComplete="off"
        >
          {/* <Form.Item label="Mã" name="code">
            <Input disabled />
          </Form.Item> */}

          <Form.Item
            label="Tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên thể loại không để trống",
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
              {
                max: 255,
                message: "Tên bài viết chỉ tối đa 255 kí tự",
              },
            ]}
          >
            <Input />
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
