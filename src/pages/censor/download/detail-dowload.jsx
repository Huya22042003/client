import { Button, Card, DatePicker, Form, Input } from "antd";
import React, { useEffect } from "react";

const DetailDowload = (props) => {
  const { category } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        code: category.code,
        name: category.name,
      });
    }
  }, [category, form]);
  return (
    <div>
      <Card>
        <Form form={form}>
          <Form.Item label="Mã GV" name="code">
            <Input style={{ width: "845px", marginLeft: "48px" }} />
          </Form.Item>
          <Form.Item label="Tên GV" name="name">
            <Input style={{ width: "845px", marginLeft: "48px" }} />
          </Form.Item>
          <Form.Item label="Ngày viết bài" name="">
            <DatePicker
              style={{ marginLeft: "10px", width: "845px", height: "40px" }}
            />
          </Form.Item>
          <Form.Item label="Tiêu đề bài viết" name="name">
            <Input />
          </Form.Item>

          <Form.Item className="flex justify-center">
            <Button type="primary">Submit</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DetailDowload;
