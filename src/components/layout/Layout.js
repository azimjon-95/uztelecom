import React, { useState, useEffect, useRef } from 'react';
import {
    UserOutlined,
    TeamOutlined,
    LogoutOutlined,
    DashboardOutlined,
} from '@ant-design/icons';

import { Layout, Menu, Modal } from 'antd';
import './style.css';
import logoOne from '../../assets/logo.svg';
import logoTwo from '../../assets/logoTwo.png';
import { Link } from 'react-router-dom';

const { Sider, Content } = Layout;

const CustomLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [activeItem, setActiveItem] = useState(null);
    const role = localStorage.getItem('role');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('role');
        window.location.href = '/login';
    };

    const showLogoutModal = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleConfirmLogout = () => {
        handleLogout();
        setModalVisible(false);
    };

    const isAdmin = role === 'admin';
    // const isUser = role === 'user';
    const isSuperAdmin = role === 'super_admin';

    const menuItems = [
        { key: '1', icon: <UserOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <Link style={{ textDecoration: "none", color: "#fff" }} to="/fileManagement">Fayl boshqaruvi</Link> },
        { key: '2', icon: <TeamOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <Link style={{ textDecoration: "none", color: "#fff" }} to="/workers">Hodimlar</Link> },
        { key: 'logout', icon: <LogoutOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <span style={{ color: "#fff" }}>Tizimdan chiqish</span>, onClick: showLogoutModal }
    ];

    const menuTeacher = [
        { key: '1', icon: <UserOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <Link style={{ textDecoration: "none", color: "#fff" }} to="/">Abonent</Link> },
        { key: 'logout', icon: <LogoutOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <span style={{ color: "#fff" }}>Tizimdan chiqish</span>, onClick: showLogoutModal }
    ];

    const menuSuperAdmin = [
        {
            key: '1',
            icon: <DashboardOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />,
            label: <Link style={{ textDecoration: "none", color: "#fff" }} to="/superAdminPanel">Super Admin Panel</Link>
        },
        {
            key: '3',
            icon: <TeamOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />,
            label: <Link style={{ textDecoration: "none", color: "#fff" }} to="/sprinters">Sprinterlar</Link>
        },
        {
            key: 'logout',
            icon: <LogoutOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />,
            label: <span style={{ color: "#fff" }}>Tizimdan chiqish</span>,
            onClick: showLogoutModal
        }
    ];

    const handleMenuClick = (item) => {
        if (item.key === 'logout') {
            showLogoutModal();
        } else {
            setActiveItem(item);
        }
    };

    const renderMobileMenuItems = (items) => {
        return items.map((item) => (
            <div
                key={item.key}
                onClick={() => handleMenuClick(item)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50px',
                    padding: "0 4px",
                    borderRadius: "7px",
                    zIndex: 10,
                    backgroundColor: activeItem?.key === item.key ? 'dodgerblue' : '',
                    cursor: 'pointer',
                    color: activeItem?.key === item.key ? "#e9e9e9" : "",
                }}
                className="mobileBottom_menu"
            >
                <span>{item.icon}</span>
                <span style={{ fontSize: '13px', textDecoration: 'none' }}>{item.label}</span>
            </div>
        ));
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout style={{ minHeight: '100vh', overflow: "hidden", background: "#e1e1e1" }}>
            <Sider style={{ background: "#03B4FF" }} onCollapse={toggleCollapse} collapsible collapsed={collapsed} className={`custom-sider ${collapsed ? 'ant-layout-sider-collapsed' : ''}`}>
                <div className="demo-logo-vertical" />
                <div className="logo">
                    <img width={collapsed ? 40 : 180} src={collapsed ? logoTwo : logoOne} alt="Logo" />
                </div>
                <Menu style={{ background: "#03B4FF" }} mode="inline"
                    items={isSuperAdmin ? menuSuperAdmin : (isAdmin ? menuItems : menuTeacher)}
                    onClick={({ key }) => handleMenuClick({ key })}
                />
            </Sider>

            <Layout className="site-layout">
                <Content>
                    <div style={{ padding: 5 }}>
                        {children}
                    </div>
                    {isMobile && (
                        <>
                            <br />
                            <br />
                            <br />
                        </>
                    )}
                </Content>
            </Layout>

            {isMobile && (
                <div ref={menuRef} className='MenuMobile menu-horizontal'>
                    {isSuperAdmin
                        ? renderMobileMenuItems(menuSuperAdmin)
                        : (isAdmin ? renderMobileMenuItems(menuItems) : renderMobileMenuItems(menuTeacher))
                    }
                </div>
            )}

            <Modal
                title="Chiqish"
                open={modalVisible}
                onOk={handleConfirmLogout}
                onCancel={handleCancel}
                okText="Ha"
                cancelText="Yo'q"
            >
                <p>Chiqmoqchimisiz?</p>
            </Modal>
        </Layout>
    );
};

export default CustomLayout;





