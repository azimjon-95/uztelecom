import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/reset.css';
import Abonents from './pages/workers/abonents/Abonents';
import Sidebar from './components/layout/Layout';
import Login from './components/login/Login';
import RegisterAbonent from './pages/workers/registerAbonents/RegisterAbonent';
import Read from './pages/admin/workers/Read';
import ScinerPage from './pages/workers/scinerPage/ScinerPage';
import './index.css';

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const role = localStorage.getItem('role');
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {role ? (
          <>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={toggleCollapse}
              style={{ backgroundColor: '#03B4FF' }}
              className="custom-sider" // Apply the custom class
            >
              <Sidebar role={role} collapsed={collapsed} />
            </Sider>
            <Layout className="site-layout">
              <Content style={{ margin: '0 16px' }}>
                <Routes>
                  {role === 'admin' ? (
                    <>
                      <Route path="/abonents" element={<Abonents />} />
                      <Route path="/read/workers" element={<Read />} />
                      <Route path="*" element={<Navigate to="/abonents" />} />
                    </>
                  ) : (
                    <>
                      <Route path="/abonents" element={<Abonents />} />
                      <Route path="/register/abonent" element={<RegisterAbonent />} />
                      <Route path="/read/barcode" element={<ScinerPage />} />
                      <Route path="*" element={<Navigate to="/abonents" />} />
                    </>
                  )}
                </Routes>
              </Content>
            </Layout>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Layout>
    </Router>
  );
};

export default App;
