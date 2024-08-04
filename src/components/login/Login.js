import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import useCRUD from '../../hooks/useCRUD'; // `useCRUD` hookni import qiling
import './style.css';

const Login = () => {
    const navigate = useNavigate();
    const { signIn, error, loading } = useCRUD('/api/users'); // API endpoint

    const onFinish = async (values) => {
        if (values.username === 'admin' && values.password === 'admin') {
            localStorage.setItem('role', 'admin');
            window.location.href = '/abonents/admin';
        } else {
            localStorage.setItem('role', 'user');
            window.location.href = '/abonents';
        }

        try {
            const user = await signIn({ username: values.username, password: values.password });
            if (user.role === 'admin') {
                window.location.href = '/abonents/admin';
            } else {
                window.location.href = '/abonents';
            }
        } catch (err) {
            console.error('Kirishda xatolik:', err);
            alert('Xatolik yuz berdi: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="login_BODY">
            <div className="login_container">
                <div className="login-box">
                    <h2>KIRISH</h2>
                    <p></p>
                    <Form
                        name="login"
                        onFinish={onFinish}
                        style={{ maxWidth: '300px', margin: 'auto', marginTop: '50px' }}
                    >
                        <div className="textbox">
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Iltimos, foydalanuvchi nomingizni kiriting!' }]}
                            >
                                <Input placeholder="Foydalanuvchi nomi" />
                            </Form.Item>
                        </div>
                        <div className="textbox">
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Iltimos, parolingizni kiriting!' }]}
                            >
                                <Input.Password placeholder="Parol" />
                            </Form.Item>
                        </div>

                        <Form.Item>
                            <Button
                                style={{ width: "100%", marginTop: "4px", backgroundColor: "#03B4FF" }}
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                Kirish
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
