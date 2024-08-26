import React, { useEffect, useState } from 'react';
import axios from '../../api';
import './scanPage.css'; // Import the CSS file for styling
import CustomLayout from '../../components/layout/Layout';

function Abonents() {
    const [fileData, setFileData] = useState([]);
    const [loading, setLoading] = useState(false);
    const id = localStorage.getItem("token")
    const [dataFile, setFileContent] = useState([]);
    const response = dataFile?.filter((i) => i.id === id);

    useEffect(() => {
        const fetchUserDataFile = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/file/get-all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                console.log(response);
                setFileContent(response?.data?.result);
            } catch (error) {
                console.error("Faylni olishda xato yuz berdi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDataFile();
    }, []);


    // Get the headers from the first item in the fileData array
    const headers = fileData.length > 0 ? Object.keys(fileData[0]) : [];

    return (
        <CustomLayout>
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
        </CustomLayout>
    );
}

export default Abonents;
