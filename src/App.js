import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import { Button, Result } from 'antd';
import Login from "./components/login/Login";
import Read from "./pages/admin/workers/Read";
import AddForm from "./pages/admin/workers/Add";
import ScanPage from "./pages/workers/ScanPage";
import FileManagement from "./pages/admin/adminPanel/AdminPanel";
import "./index.css";
import Abonents from "./pages/workers/AllAbonents";

const App = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const isAdmin = role === "admin";
  const isUser = role === "user";

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {isAdmin && (
        <>
          <Route path="/fileManagement" element={<FileManagement />} />
          <Route path="/addForm" element={<AddForm />} />
          <Route path="/workers" element={<Read />} />
          <Route path="/" element={<FileManagement />} />
        </>
      )}
      {isUser && (
        <>
          <Route path="/scan/:id" element={<ScanPage />} />
          <Route path="/" element={<Abonents />} />
        </>
      )}
      <Route path="*" element={
        <div className="not-found">
          <Result
            status="404"
            title="404"
            subTitle="Kechirasiz, bu sahifa mavjud emas."
            extra={
              <Button type="primary" onClick={() => navigate('/')}>
                Asosiy sahifaga qaytish
              </Button>
            }
          />
        </div>
      } />
    </Routes>
  );
};

export default App;
