// src/components/layout/Sidebar.js

import React, { useState } from 'react';
import { Menu, Modal } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    UserOutlined,
    TeamOutlined,
    UserAddOutlined,
    SettingOutlined,
    LogoutOutlined,
    ScanOutlined,
} from '@ant-design/icons';
import './style.css';
import logoOne from '../../assets/logoOne.png';
import logoTwo from '../../assets/logoTwo.png';
import BarCodeReader from '../barCodeReader/BarCodeReader';

const Sidebar = ({ role, collapsed, onScan }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [openQrScanner, setOpenQrScanner] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        localStorage.removeItem('role');
        setIsModalVisible(false);
        window.location.href = '/login';
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleClick = (e) => {
        if (e.key === 'logout') {
            showModal();
        } else {
            navigate(e.key);
        }
    };

    return (
        <>
            <Menu
                selectedKeys={[location.pathname]}
                mode="inline"
                onClick={handleClick}
                style={{ backgroundColor: '#e1e1e1' }}
            >
                <div className="logo">
                    <img width={collapsed ? 38 : 150} src={collapsed ? logoTwo : logoOne} alt="" />
                </div>

                {role === 'admin' ? (
                    <>
                        <Menu.Item key="/admin" icon={<SettingOutlined />}>
                            Admin Panel
                        </Menu.Item>
                        <Menu.Item key="/read/workers" icon={<TeamOutlined />}>
                            Hodimlar
                        </Menu.Item>
                    </>
                ) : role === 'user' ? (
                    <>
                        <Menu.Item key="/abonents" icon={<UserOutlined />}>
                            Abonentlar
                        </Menu.Item>
                        <Menu.Item key="/register/abonent" icon={<UserAddOutlined />}>
                            Ro'yhatga olish
                        </Menu.Item>
                        <Menu.Item onClick={() => setOpenQrScanner(!openQrScanner)} icon={<ScanOutlined />}>
                            Read Barcode
                        </Menu.Item>
                        {openQrScanner &&
                            <div style={{ width: "200px", height: "200px", border: "1px solid grey" }}>

                                <BarCodeReader />
                            </div>
                        }
                    </>
                ) : null}
                <Menu.Item key="logout" icon={<LogoutOutlined />}>
                    Logout
                </Menu.Item>
            </Menu>
            <Modal
                title="Chiqish"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="OK"
                cancelText="Bekor qilish"
            >
                <p>Siz haqiqatdan ham chiqmoqchimisiz?</p>
            </Modal>
        </>
    );
};

export default Sidebar;
