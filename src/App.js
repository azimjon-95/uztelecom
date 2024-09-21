import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import { Button, Result } from 'antd';
import Login from "./components/login/Login";
import Read from "./pages/admin/workers/Read";
import ScanPage from "./pages/workers/ScanPage";
import FileManagement from "./pages/admin/adminPanel/AdminPanel";
import SuperAdminPanel from "./pages/superadmin/SuperAdminPanel"; // SuperAdmin panelini import qilish
import "./index.css";
import SprinterTable from "./pages/superadmin/sprinters/Sprinters";

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
  const isSuperAdmin = role === "super_admin"; // SuperAdmin rolini aniqlash

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {isAdmin && (
        <>
          <Route path="/fileManagement" element={<FileManagement />} />
          <Route path="/workers" element={<Read />} />
          <Route path="/" element={<FileManagement />} />
        </>
      )}
      {isUser && (
        <>
          <Route path="/scan/:id" element={<ScanPage />} />
          <Route path="/" element={<ScanPage />} />
        </>
      )}
      {isSuperAdmin && (
        <>
          <Route path="/superAdminPanel" element={<SuperAdminPanel />} /> {/* SuperAdmin sahifasi */}
          <Route path="/sprinters" element={<SprinterTable />} /> {/* SuperAdmin sahifasi */}
          <Route path="/" element={<SuperAdminPanel />} /> {/* Asosiy sahifa super adminlar uchun */}
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
