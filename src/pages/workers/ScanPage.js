import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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
    }, [navigate]);



    const fetchFileData = async (fileId) => {
        setLoading(true);
        try {
            const response = await api.get(`/spirinter/show/${fileId}`);
            const data = response?.data?.result;

            // Agar `path` maydoni mavjud bo'lsa va string bo'lsa, uni JSON.parse orqali arrayga o'zgartirish
            if (data && data.path && typeof data.path === 'string') {
                try {
                    const parsedData = JSON.parse(data.path);  // JSON matnni arrayga aylantirish
                    if (Array.isArray(parsedData)) {
                        setFileData(parsedData);  // To'g'ri olingan arrayni setFileData ga o'rnatish
                    } else {
                        setFileData([]);  // Agar array emas bo'lsa, bo'sh array o'rnatamiz
                        console.error('Expected an array but got something else:', parsedData);
                    }
                } catch (parseError) {
                    console.error('Parsing error:', parseError);
                    setFileData([]);  // Parsingda xatolik bo'lsa, bo'sh array
                }
            } else {
                setFileData([]);  // Default bo'sh array
                console.error('Expected a string but got something else:', data.path);
            }

        } catch (error) {
            console.error('Xatolik yuz berdi', error);
        }
        setLoading(false);
    };


    // Get the headers from the first item in the fileData array
    const headers = fileData.length > 0 ? Object.keys(fileData[0]) : [];

    return (
        <div className="scan-page">
            <h2 className="page-title">QR Kodni Skan Qilish Sahifasi</h2>
            {loading ? (
                <p className="loading-message">Fayl ma'lumotlari yuklanmoqda...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {fileData.map((item) => (
                            <tr key={item.id}>
                                {headers.map((header) => (
                                    <td key={header}>{item[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ScanPage;
