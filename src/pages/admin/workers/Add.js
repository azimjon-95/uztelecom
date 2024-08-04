import React, { useEffect } from "react";
import { Form, Input, Button, Col, message, Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useCRUD from "../../../hooks/useCRUD";
import CustomLayout from "../../../components/layout/Layout";

const AddForm = () => {
  const { updateData } = useCRUD("/users");
  const { createData } = useCRUD("/auth/register");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = location.state?.currentUser || null;
  const isEdit = !!currentUser;

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(currentUser);
    }
  }, [isEdit, currentUser, form]);

  const onFinish = (values) => {
    if (isEdit) {
      updateData(currentUser.id, values).then(() => {
        message.success("Ma'lumotlar muvaffaqiyatli yangilandi!");
        navigate(-1);
      });
    } else {
      let result = createData(values);
      console.log(result);

      //  .then(() => {
      //     message.success("Ishchi muvaffaqiyatli qo'shildi!");
      //     navigate(-1);
      //   });
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <CustomLayout>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <h2
          style={{
            textAlign: "center",
            color: "gray",
            lineHeight: "30px",
            marginTop: "10px",
          }}
        >
          {isEdit ? "Malumotlarni yangilash" : "Ishchilarni Qabul qilish"}
        </h2>
        <Col span={8}>
          <Form.Item
            name="full_name"
            label="Ism"
            rules={[{ required: true, message: "Ism va Familiya kiriting!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="phone_number"
            label="Telefon raqam"
            rules={[{ required: true, message: "Telefon raqam kiriting!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "password  kiriting!" }]}
          >
            <Input.Password />
          </Form.Item>
        </Col>

        <Col>
          {/* admin or user for select */}
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Role kiriting!" }]}
          >
            <Select
              options={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
              ]}
            />
          </Form.Item>
        </Col>

        <div style={{ width: "100%", display: "flex", gap: "5px" }}>
          <Button style={{ width: "100%" }} type="primary" htmlType="submit">
            {isEdit ? "Yangilash" : "Roʻyxatdan oʻtish"}
          </Button>
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ marginLeft: 8 }}
          >
            Orqaga
          </Button>
        </div>
      </Form>
    </CustomLayout>
  );
};

export default AddForm;
