import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import useCRUD from '../../../hooks/useCRUD';
import CustomLayout from '../../../components/layout/Layout';

const AddForm = () => {
    const { createData, updateData } = useCRUD('/users');
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
                message.success('Ma\'lumotlar muvaffaqiyatli yangilandi!');
                navigate(-1);
            });
        } else {
            createData(values).then(() => {
                message.success('Ishchi muvaffaqiyatli qo\'shildi!');
                navigate(-1);
            });
        }
    };


    const handleBack = () => {
        navigate(-1);
    };

    return (
        <CustomLayout>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <h2 style={{ textAlign: "center", color: "gray", lineHeight: "30px", marginTop: "10px" }}>
                    {isEdit ? 'Malumotlarni yangilash' : 'Ishchilarni Qabul qilish'}
                </h2>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="name"
                            label="Ism"
                            rules={[{ required: true, message: 'Iltimos, ismni kiriting!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Iltimos, emailni kiriting!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="phone"
                            label="Telefon raqam"
                            rules={[{ required: true, message: 'Iltimos, telefon raqamni kiriting!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="address"
                            label="Manzil"
                            rules={[{ required: true, message: 'Iltimos, manzilni kiriting!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="city"
                            label="Shahar"
                            rules={[{ required: true, message: 'Iltimos, shaharni kiriting!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="country"
                            label="Davlat"
                            rules={[{ required: true, message: 'Iltimos, davlatni kiriting!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="postalCode"
                            label="Pochta kodi"
                            rules={[{ required: true, message: 'Iltimos, pochta kodini kiriting!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="company"
                            label="Kompaniya"
                            rules={[{ required: true, message: 'Iltimos, kompaniya nomini kiriting!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="position"
                            label="Lavozim"
                            rules={[{ required: true, message: 'Iltimos, lavozimni kiriting!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{ width: "100%", display: "flex", gap: "5px" }}>
                    <Button style={{ width: "100%" }} type="primary" htmlType="submit">
                        {isEdit ? 'Yangilash' : 'Roʻyxatdan oʻtish'}
                    </Button>
                    <Button type="default" icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginLeft: 8 }}>
                        Orqaga
                    </Button>
                </div>
            </Form>
        </CustomLayout>
    );
};

export default AddForm;
