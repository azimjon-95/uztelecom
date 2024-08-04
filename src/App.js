import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import 'antd/dist/reset.css';
import Abonents from './pages/workers/abonents/Abonents';
import Login from './components/login/Login';
import RegisterAbonent from './pages/workers/registerAbonents/RegisterAbonent';
import Read from './pages/admin/workers/Read';
import ScinerPage from './pages/workers/scinerPage/ScinerPage';
import './index.css';
import AddForm from './pages/admin/workers/Add';
import Mijozlar from './pages/admin/mijozlar/Mijozlar';

const App = () => {
  const role = useMemo(() => localStorage.getItem('role'), []);

  const MainComponent = role === 'admin' ? Mijozlar : Abonents;

  return (
    <Routes>
      {role === 'admin' || role === 'user' ? (
        <>
          <Route path="/abonents" element={<Abonents />} />
          <Route path="/abonents/admin" element={<Mijozlar />} />
          <Route path="/addForm" element={<AddForm />} />
          <Route path="/workers" element={<Read />} />
          <Route path="/createAbonents" element={<RegisterAbonent />} />
          <Route path="/barcode" element={<ScinerPage />} />
          <Route path="/login" element={<MainComponent />} />
          <Route path="/" element={<MainComponent />} />
        </>
      ) : (
        <Route path="/login" element={<Login />} />
      )}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default App;
