import React, { useState, useEffect, useRef } from 'react';
import {
    UserOutlined,
    TeamOutlined,
    UserAddOutlined,
    SettingOutlined,
    BarcodeOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu, Modal } from 'antd'; // Modal import qiling
import './style.css';
import logoOne from '../../assets/logo.svg';
import logoTwo from '../../assets/logoTwo.png';
import { Link, useNavigate } from 'react-router-dom';
import BarCodeReader from '../barCodeReader/BarCodeReader';

const { Sider, Content } = Layout;

const CustomLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [activeItem, setActiveItem] = useState(null);
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);
    const role = localStorage.getItem('role');
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false); // Modal ko'rsatish holatini saqlash uchun

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

    const menuItems = [
        { key: '1', icon: <UserOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <Link style={{ textDecoration: "none", color: "#fff" }} to="/abonents/admin">Abonentlar</Link> },
        { key: '2', icon: <TeamOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <Link style={{ textDecoration: "none", color: "#fff" }} to="/workers">Hodimlar</Link> },
        { key: 'logout', icon: <LogoutOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <span style={{ color: "#fff" }}>Tizimdan chiqish</span>, onClick: showLogoutModal }
    ];

    const menuTeacher = [
        { key: '1', icon: <UserOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <Link style={{ textDecoration: "none", color: "#fff" }} to="/abonents">Abonentlar</Link> },
        { key: '2', icon: <UserAddOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <Link style={{ textDecoration: "none", color: "#fff" }} to="/createAbonents">{isMobile ? "Register" : "Ro'yhatga olish"}</Link> },
        { key: '3', icon: <BarcodeOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <span style={{ color: "#fff" }}>{isMobile ? "Barcode" : "Barcode o'qish"}</span>, onClick: () => setShowBarcodeModal(true) },
        { key: 'logout', icon: <LogoutOutlined style={isMobile ? { fontSize: '22px', color: "#fff" } : { color: "#fff" }} />, label: <span style={{ color: "#fff" }}>Tizimdan chiqish</span>, onClick: showLogoutModal }
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
                    items={role === 'admin' ? menuItems : menuTeacher}
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
                    {role === 'owner'
                        ? renderMobileMenuItems(menuItems)
                        : renderMobileMenuItems(menuTeacher)
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

            <Modal
                title="Barcode o'qish"
                open={showBarcodeModal}
                onCancel={() => setShowBarcodeModal(false)}
                footer={null}
            >
                <BarCodeReader />
            </Modal>
        </Layout>
    );
};

export default CustomLayout;












// const Sidebar = ({ role, collapsed }) => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [isModalVisible, setIsModalVisible] = React.useState(false);

//     const showModal = () => {
//         setIsModalVisible(true);
//     };

//     const handleOk = () => {
//         localStorage.removeItem('role');
//         setIsModalVisible(false);
//         window.location.href = '/login';
//     };

//     const handleCancel = () => {
//         setIsModalVisible(false);
//     };

//     const handleClick = (e) => {
//         if (e.key === 'logout') {
//             showModal();
//         } else {
//             navigate(e.key);
//         }
//     };

//     return (
//         <>
//             <Menu
//                 selectedKeys={[location.pathname]}
//                 mode="inline"
//                 onClick={handleClick}
//                 style={{ backgroundColor: '#e1e1e1' }}
//             >
//                 <div className="logo">
//                     <img width={collapsed ? 38 : 150} src={collapsed ? logoTwo : logoOne} alt="" />
//                 </div>

//                 {role === 'admin' ? (
//                     <>
//                         <Menu.Item key="/admin" icon={<SettingOutlined />}>
//                             Admin Panel
//                         </Menu.Item>
//                         <Menu.Item key="/read/workers" icon={<TeamOutlined />}>
//                             Hodimlar
//                         </Menu.Item>
//                     </>
//                 ) : (
//                     <>
//                         <Menu.Item key="/abonents" icon={<UserOutlined />}>
//                             Abonentlar
//                         </Menu.Item>
//                         <Menu.Item key="/register/abonent" icon={<UserAddOutlined />}>
//                             Ro'yhatga olish
//                         </Menu.Item>
//                         <Menu.Item key="/read/barcode" icon={<BarcodeOutlined />}>
//                             Barcode o'qish
//                         </Menu.Item>
//                     </>
//                 )}
//                 <Menu.Item key="logout" icon={<LogoutOutlined />}>
//                     Logout
//                 </Menu.Item>
//             </Menu>
//             <Modal
//                 title="Chiqish"
//                 open={isModalVisible}
//                 onOk={handleOk}
//                 onCancel={handleCancel}
//                 okText="OK"
//                 cancelText="Bekor qilish"
//             >
//                 <p>Siz haqiqatdan ham chiqmoqchimisiz?</p>
//             </Modal>
//         </>
//     );
// };

// export default Sidebar;




// style={{ backgroundColor: '#e1e1e1' }}
//             >
//                 <div className="logo">
//                     <img width={collapsed ? 38 : 150} src={collapsed ? logoTwo : logoOne} alt="" />
//                 </div>