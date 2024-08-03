import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import useCRUD from '../../../hooks/useCRUD';

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
            updateData(currentUser.id, values).then(() => navigate('/read'));
        } else {
            createData(values).then(() => navigate('/read'));
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input the name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please input the email!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {isEdit ? 'Update' : 'Register'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddForm;
