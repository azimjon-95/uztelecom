import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import useCRUD from '../../hooks/useCRUD'; // useCRUD kancasini import qilish
import './scanPage.css'; // Import the CSS file for styling

function ScanPage() {
    const navigate = useNavigate();
    const [fileData, setFileData] = useState([]);
    const { getFileData, loading, error } = useCRUD(); // useCRUD'dan fetchData funksiyasini chaqirish
    const { id } = useParams();
    const workerId = localStorage.getItem("workerId")

    const res = fileData?.filter(({ userId }) => userId?.id === workerId);
    console.log(res);

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
        try {
            const response = await getFileData(`${fileId}`);  // useCRUD'dan fetchData chaqirish
            setFileData(response);  // Fayl ma'lumotlarini holatga o'rnatamiz
        } catch (error) {
            console.error('Xatolik yuz berdi', error);
        }
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
            {error && <p className="error-message">Xatolik yuz berdi: {error.message}</p>}
        </div>
    );
}

export default ScanPage;
