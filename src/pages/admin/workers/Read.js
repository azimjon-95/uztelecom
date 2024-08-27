import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, Modal, Select, Col, message } from "antd";
import { useLocation } from "react-router-dom";
import useCRUD from "../../../hooks/useCRUD";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from '../../../api';
import "./style.css";
import CustomLayout from "../../../components/layout/Layout";
import { ArrowLeftOutlined } from "@ant-design/icons";

const Read = () => {
  const { data, loading, fetchData } = useCRUD("/user/get");
  const [openBox, setOpenBox] = useState(false);
  const location = useLocation();
  const [form] = Form.useForm();
  const currentUser = location.state?.currentUser || null;
  const [isEdit, setIsEdit] = useState(false); // State for edit mode
  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(currentUser);
      setIsEdit(true); // Set edit mode to true
      setOpenBox(true);
    }
  }, [isEdit, currentUser, form]);

  useEffect(() => {
    fetchData();
  }, []);


  const onFinish = async (values) => {
    try {
      // Remove "+" from phone_number
      const formattedValues = {
        ...values,
        phone_number: values.phone_number.replace("+", "")
      };

      // Set your token here
      const token = localStorage.getItem("token"); // Replace with your actual token

      // Make the API call based on `isEdit`
      const response = isEdit
        ? await axios.put(`/users/${currentUser.id}`, formattedValues, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        : await axios.post('/auth/register', formattedValues, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      // Handle successful response
      if (response?.data?.result) {
        message.success(isEdit ? "Ma'lumotlar muvaffaqiyatli yangilandi!" : "Foydalanuvchi muvaffaqiyatli qo'shildi!");
        setOpenBox(false); // Close the form box
        form.resetFields(); // Reset the form
        fetchData(); // Refresh the data
      } else {
        // If no result, throw an error
        throw new Error(response?.data?.message || "Xatolik yuz berdi!");
      }
    } catch (error) {
      // Handle and display error messages
      message.error(error?.response?.data?.message || error.message || "Xatolik yuz berdi!");
    }
  };


  const handleBack = () => {
    setOpenBox(false);
    form.resetFields();
    setIsEdit(false); // Reset edit mode on back
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsEdit(true); // Set edit mode to true
    setOpenBox(true);
  };

  const { confirm } = Modal;

  const handleDelete = (record) => {
    confirm({
      title: 'Ishonchingiz komilmi?',
      content: `Siz ${record.full_name} foydalanuvchisini o'chirishni xohlaysizmi?`,
      okText: 'Ha',
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          await axios.delete(`https://api.uztelecom.dadabayev.uz/api/delete/user/${record.id}`);
          message.success("Foydalanuvchi muvaffaqiyatli o'chirildi");
          // Reload or update the data after deletion
        } catch (error) {
          message.error("Foydalanuvchini o'chirishda xatolik yuz berdi");
        }
      },
      onCancel() {
        console.log('Bekor qilindi');
      },
    });
  };


  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Ism / Familiya", dataIndex: "full_name", key: "full_name" },
    { title: "Telefon raqam", dataIndex: "phone_number", key: "phone_number" },
    { title: "Role", dataIndex: "role", key: "role", render: (e) => e.name },
    {
      title: "Tahrirlash",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            type="primary"
            style={{ marginRight: 8 }}
          >
            <EditOutlined />
          </Button>
        </>
      ),
    },
    // {
    //   title: "O'chirish",
    //   key: "action",
    //   render: (text, record) => (
    //     <>
    //       <Button
    //         onClick={() => handleDelete(record)}
    //         type="primary"
    //         danger
    //         style={{ marginRight: 8 }}
    //       >
    //         <DeleteOutlined />
    //       </Button>
    //     </>
    //   ),
    // },
  ];

  return (
    <CustomLayout>
      <h2 style={{ textAlign: "center", color: "gray", lineHeight: "30px", marginTop: "10px" }}>
        Ishchilar Ro'yxati
      </h2>
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Button type="primary" onClick={() => {
          setIsEdit(false); // Set edit mode to false for new user
          setOpenBox(true);
        }} style={{ marginBottom: 16 }}>
          Foydalanuvchi Qo'shish
        </Button>
      </div>
      <Table
        pagination={false}
        size="small"
        columns={columns}
        dataSource={data?.data?.result}
        rowKey="id"
        loading={loading}
        bordered
        scroll={{ y: 500 }} // Yoki sizga kerakli balandlikda
      />
      {openBox && (
        <div className="edi_banner">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <h2 style={{ textAlign: "center", color: "gray", lineHeight: "30px", marginTop: "10px" }}>
              {isEdit ? "Ma'lumotlarni yangilash" : "Ishchilarni Qabul qilish"}
            </h2>
            <Col style={{ width: "100%" }}>
              <Form.Item style={{ width: "100%" }}
                name="full_name"
                label="Ism"
                rules={[{ required: true, message: "Ism va Familiya kiriting!" }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col style={{ width: "100%" }}>
              <Form.Item style={{ width: "100%" }}
                name="phone_number"
                label="Telefon raqam"
                rules={[{ required: true, message: "Telefon raqam kiriting!" }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col style={{ width: "100%" }}>
              <Form.Item style={{ width: "100%" }}
                name="password"
                label="Password"
                rules={[{ required: !isEdit, message: "Parol kiriting!" }]}
              >
                <Input.Password disabled={isEdit} />
              </Form.Item>
            </Col>
            <Col>
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
        </div>
      )}
    </CustomLayout>
  );
};

export default Read;

