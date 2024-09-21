import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, Spin } from 'antd';
import './scanPage.css'; // Import the CSS file for styling
import api from '../../api/index';

function ScanPage() {
    const navigate = useNavigate();
    const [fileData, setFileData] = useState([]);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            navigate('/');  // QR kodda file_id bo'lmasa bosh sahifaga yo'naltiriladi
        } else {
            const isAuthenticated = Boolean(localStorage.getItem('token'));  // Foydalanuvchi login qilganmi tekshiramiz
            if (!isAuthenticated) {
                navigate('/login', { state: { id } });  // Login qilmagan bo'lsa login sahifasiga yo'naltiriladi va file_id saqlanadi
            } else {
                fetchFileData(id);
            }
        }
    }, [navigate, id]);

    const fetchFileData = async (fileId) => {
        setLoading(true);
        try {
            const response = await api.get(`/spirinter/show/${fileId}`);
            const data = response?.data?.result;

            // Agar data obyekt bo'lsa, uni massivga aylantiramiz
            if (data) {
                setFileData(Array.isArray(data) ? data : [data]);  // Obyektni massivga aylantirish
            } else {
                setFileData([]);  // Agar data bo'lmasa, bo'sh massivga o'rnatamiz
            }
        } catch (error) {
            console.error('Xatolik yuz berdi', error);
            setFileData([]);  // Xato bo'lsa ham bo'sh massiv
        }
        setLoading(false);
    };
    // Columns for the main table
    const columns = [
        {
            title: 'Texnik Ma\'lumotlar',  // Uzbek title for technical_data
            dataIndex: 'technical_data',
            key: 'technical_data',
        },
        {
            title: 'QR Kod',  // Uzbek title for qrCodeUrl
            dataIndex: 'qrCodeUrl',
            key: 'qrCodeUrl',
            render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">QR Ko'rish</a>,
        },
    ];

    // Columns for the nested "customers" data
    const customerColumns = [
        {
            title: 'Foydalanuvchi Login',  // Uzbek title for login
            dataIndex: 'login',
            key: 'login',
        },
        {
            title: 'Ismi',  // Uzbek title for subscriber (name)
            dataIndex: 'subscriber',
            key: 'subscriber',
        },
        {
            title: 'Manzil',  // Uzbek title for address
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Shaxsiy Tekshiruv',  // Uzbek title for person_check
            dataIndex: 'person_check',
            key: 'person_check',
        },
        {
            title: 'Port Raqami',  // Uzbek title for port_number
            dataIndex: 'port_number',
            key: 'port_number',
        },
    ];

    // Expanded row to show "customers" data
    const expandableRowRender = (record) => {
        const { customers } = record;
        return (
            <Table
                columns={customerColumns}
                dataSource={customers}
                pagination={false}
                rowKey={(customer) => customer.id} // Unique row key for Ant Design Table
                scroll={{ x: '100%' }}  // Allow horizontal scroll if too wide
            />
        );
    };

    return (
        <div className="scan-page">
            <h2 className="page-title">QR Kodni Skan Qilish Sahifasi</h2>
            {loading ? (
                <Spin tip="Fayl ma'lumotlari yuklanmoqda..." />
            ) : (
                <Table
                    columns={columns}
                    dataSource={fileData}
                    expandable={{ expandedRowRender: expandableRowRender }}
                    rowKey={(record) => record.id}  // Unique row key for main table
                    scroll={{ x: '100%' }}  // Enable horizontal scroll for small screens
                    pagination={false}
                />
            )}
        </div>
    );
}

export default ScanPage;



