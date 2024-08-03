import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

const Login = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        // Foydalanuvchini autentifikatsiya qilish (simple example)
        if (values.username === 'admin' && values.password === 'admin') {
            localStorage.setItem('role', 'admin');
        } else {
            localStorage.setItem('role', 'user');
        }
        navigate('/dashboard');
    };

    return (
        <Form
            name="login"
            onFinish={onFinish}
            style={{ maxWidth: '300px', margin: 'auto', marginTop: '100px' }}
        >
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Login
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;

