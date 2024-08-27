import React, { useState, useRef, useEffect } from 'react';
import { Table, Button, notification, Select, Upload, Modal } from 'antd';
import axios from '../../../api';
import ReactDOM from 'react-dom'; // ReactDOM ni import qiling
import { UploadOutlined } from '@ant-design/icons';
import { DownloadOutlined, MergeOutlined, EyeOutlined } from '@ant-design/icons';
import { FaCodeMerge } from "react-icons/fa6";
import "./style.css"
import { AiTwotoneDelete } from "react-icons/ai";
import QRCode from 'qrcode.react';
import { BsQrCode } from "react-icons/bs";
import CustomLayout from '../../../components/layout/Layout';
import useCRUD from "../../../hooks/useCRUD";
import * as XLSX from 'xlsx';
const { Option } = Select;

// Component for the detailed view of the file
const FileDetails = ({ path, onClose }) => (
    <div className="file-details">
        <div className="file-name">
            {path.map((file, index) => (
                <div key={index}>
                    <h3>Fayl {index + 1}</h3>
                    <ul>
                        {Object.keys(file).map((key, keyIndex) => (
                            <li key={`${index}-${keyIndex}`}>
                                <strong>{key}:</strong> {file[key]}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <Button onClick={onClose} type="primary" style={{ marginBottom: '20px' }}>
                Yopish
            </Button>
        </div>
    </div >
);

const FileManagement = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataFile, setFileContent] = useState([]);
    const { createData } = useCRUD("/file/upload");
    const { data: AllUsers, fetchData } = useCRUD("/user/get");
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [fileToUnMerge, setFileToUnMerge] = useState(null);
    const [column, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [isMergeModalVisible, setIsMergeModalVisible] = useState([]);

    const usersArray = AllUsers?.data?.result || [];
    const users = usersArray.filter(({ role: { name } }) => name === "user");
    useEffect(() => {
        const fetchUserDataFile = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/file/get-all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                setFileContent(response?.data?.result);
            } catch (error) {
                console.error("Faylni olishda xato yuz berdi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDataFile();
        fetchData();
    }, [setFileContent]);
    console.log(dataFile);

    const sendDataToServer = async () => {
        try {
            await createData({ file: data });
            notification.success({ message: 'Ma\'lumotlar muvaffaqiyatli yuborildi!' });
            setData([]);
        } catch (error) {
            console.error("Serverga ma'lumot jo'natishda xatolik:", error);
            notification.error({ message: 'Ma\'lumotlar jo\'natishda xatolik yuz berdi.' });
        }
    };
    const handleFileUpload = async (info) => {
        const file = info.file.originFileObj || info.file;
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            if (jsonData?.length > 0) {
                const dynamicColumns = Object.keys(jsonData[0]);
                setColumns(dynamicColumns);
            }
            const dataWithInitialUserId = jsonData?.map((row) => ({
                ...row,
            }));
            setData(dataWithInitialUserId);
        };
        if (file) {
            reader.readAsBinaryString(file);
        }
    };

    const handleUserLink = (fileId) => {
        setSelectedFileId(fileId);
        setIsUserModalVisible(true);
    };

    const handleSaveUserLink = async () => {
        // Validate input values

        try {
            // Send the request
            await axios.post('/file/merge', {
                file_id: parseInt(selectedFileId, 10), // Ensure file_id is an integer
                user_id: parseInt(selectedUsers, 10),   // Ensure user_id is an integer
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            });

            // Success notification
            notification.success({ message: 'Foydalanuvchi muvaffaqiyatli bog\'landi!' });

            // Close the modal
            setIsUserModalVisible(false);
        } catch (error) {
            // Detailed error handling
            if (error.response) {
                console.error('Server Response:', error.response.data);
                const errorMessage = error.response.data.message || 'Foydalanuvchini bog\'lashda xatolik yuz berdi';
                notification.error({ message: errorMessage });
            } else {
                console.error('Error Message:', error.message);
                notification.error({ message: 'Tarmoq yoki server xatosi yuz berdi.' });
            }
        }
    };



    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCloseModal = () => {
        setIsModalVisible(true);
    };
    const handleSaveUnMerge = async () => {
        try {
            await axios.post('/file/un-merge', {
                file_id: fileToUnMerge,
                user_ids: selectedUsers,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            notification.success({ message: 'Foydalanuvchilar muvaffaqiyatli ajratildi!' });
            handleCloseModal(); // Modalni yopish
        } catch (error) {
            console.error(error);
            notification.error({ message: 'Foydalanuvchilarni ajratishda xatolik yuz berdi' });
        }
    };

    const handleDeleteUser = (userId) => {
        setSelectedUsers((prev) => [...prev, userId]);
    };





    const handleDownloadFile = async (fileId) => {
        try {
            // Ma'lumotni olish
            const response = dataFile?.filter((i) => i.id === fileId);

            if (response.length > 0) {
                const fileData = response[0].path;

                // Excel faylni yaratish
                const worksheet = XLSX.utils.json_to_sheet(fileData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

                // Faylni yuklab olish uchun yaratish
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'data.xlsx';
                link.click();

                notification.success({ message: 'Fayl muvaffaqiyatli yuklab olindi!' });
            } else {
                notification.warning({ message: 'Fayl topilmadi!' });
            }
        } catch (error) {
            console.error(error);
            notification.error({ message: 'Faylni yuklab olishda xatolik yuz berdi' });
        }
    };



    const handleDelete = async (id) => {
        try {
            await axios.delete(`/file/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });

            // Notify success
            notification.success({
                message: 'Success',
                description: 'Fayl muvaffaqiyatli o\'chirildi.',
                placement: 'bottomRight',
            });
            // Optionally update the UI or state to reflect the deletion
        } catch (error) {
            console.error('Failed to delete file:', error);
            notification.error({
                message: 'Xato',
                description: 'Faylni o\'chirishda xatolik yuz berdi.',
                placement: 'bottomRight',
            });
        }
    };
    const confirmDelete = (id) => {
        Modal.confirm({
            title: 'O\'chirishni tasdiqlang',
            content: 'Siz ushbu faylni o\'chirishni tasdiqlaysizmi?',
            okText: 'Ha',
            okType: 'danger',
            cancelText: 'Yo\'q',
            onOk: () => handleDelete(id),
        });
    };



    const handleDownloadQrCode = (id) => {
        // QR-kod uchun URL-ni yaratamiz
        const qrCodeUrl = `https://uztelecom-xi.vercel.app/login?id=${id}`;

        // QR kodni render qilish uchun avval div elementiga qo'yamiz
        const qrContainer = document.createElement('div');
        document.body.appendChild(qrContainer);

        // QR-kodni DOM ichida yaratamiz
        const qrCode = (
            <QRCode value={qrCodeUrl} size={128} renderAs="svg" />
        );
        ReactDOM.render(qrCode, qrContainer);

        // Yaratilgan SVG elementini olamiz
        const svg = qrContainer.querySelector('svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            // QR-kod uchun yuklab olish linki yaratish
            const link = document.createElement('a');
            link.href = url;
            link.download = `qrcode_${id}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // URL va DOMni tozalaymiz
            URL.revokeObjectURL(url);
            ReactDOM.unmountComponentAtNode(qrContainer);
            document.body.removeChild(qrContainer);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: "Ko'rish",
            key: 'actions-view',
            render: (text, record) => (
                <Button
                    onClick={() => setSelectedFile(record.path)}
                    style={{ marginRight: 8 }}
                >
                    <EyeOutlined />
                </Button>
            ),
        },
        {
            title: 'Yuklab olish',
            key: 'actions-download',
            render: (text, record) => (
                <Button
                    onClick={() => handleDownloadFile(record.id)}
                    style={{ marginRight: 8 }}
                >
                    <DownloadOutlined />
                </Button>
            ),
        },
        {
            title: 'Ajratish',
            key: 'actions-unmerge',
            render: (text, record) => (
                <Button
                    onClick={() => {
                        handleCloseModal(true); // Modalni ko'rsatish
                        // tanlangan foydalanuvchilarni o'rnatish
                        setIsMergeModalVisible([record]);
                    }}
                    style={{ marginRight: 8 }}
                >
                    <FaCodeMerge />
                </Button>
            ),
        },
        {
            title: "User Bog'lash",
            key: 'actions-merge',
            render: (text, record) => (
                <Button
                    onClick={() => handleUserLink(record.id)}
                >
                    <MergeOutlined />
                </Button>
            ),
        },
        {
            title: "QR-kod",
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button
                        onClick={() => handleDownloadQrCode(record.id)}
                        style={{ marginTop: 8 }}
                    >
                        <BsQrCode /> QR Yuklab olish
                    </Button>
                </div>
            ),
        },
        {
            title: "Faylni o'chirish",
            key: 'actions-delete',
            render: (text, record) => (
                <Button
                    onClick={() => confirmDelete(record.id)}
                >
                    <AiTwotoneDelete />
                </Button>
            ),
        },
    ];


    const unMergedUsers = { ...isMergeModalVisible[0] };
    return (
        <CustomLayout>
            <div>
                <h2 style={{ textAlign: "center" }}>Fayllarni Boshqarish</h2>
                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    {data.length > 0 ?
                        <Button onClick={sendDataToServer} type="primary" style={{ marginTop: 20 }}>Ma'lumotlarni Yuborish</Button>
                        :
                        <Upload beforeUpload={() => false} onChange={handleFileUpload} maxCount={1} accept=".xls,.xlsx">
                            <Button icon={<UploadOutlined />}>Fayl yuklash</Button>
                        </Upload>
                    }
                </div>
                {data?.length > 0 && (
                    <table className="data-table">
                        <thead>
                            <tr>
                                {column.map((col) => (
                                    <th key={col} style={{ border: "1px solid black", padding: 10 }}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {column.map((col) => (
                                        <td key={col} style={{ border: "1px solid black", padding: 10 }}>
                                            {row[col]}
                                        </td>
                                    ))}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <Table pagination={false} size="small" columns={columns} dataSource={dataFile} rowKey="id" loading={loading} />
                {selectedFile && (
                    <FileDetails path={selectedFile} onClose={() => setSelectedFile(null)} />
                )}

                {/* User Bog'lash Modal */}
                <Modal
                    title="User Bog'lash"
                    open={isUserModalVisible}
                    onOk={handleSaveUserLink}
                    onCancel={() => setIsUserModalVisible(false)}
                >
                    <Select
                        mode="multiple"
                        placeholder="Foydalanuvchilarni tanlang"
                        onChange={setSelectedUsers}
                        style={{ width: '100%' }}
                    >
                        {users?.map(user => (
                            <Option key={user.id} value={user.id}>{user.full_name} - {user.phone_number}</Option>
                        ))}
                    </Select>
                </Modal>

                <Modal
                    title="Foydalanuvchilarni ajratish"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onOk={handleSaveUnMerge}
                >


                    <>
                        {unMergedUsers.users?.map((user) => (
                            <div className="unmorgeUser" key={user.id}>
                                <p>{user.full_name}</p> <p>+{user.phone_number}</p>
                                <Button
                                    onClick={() => handleDeleteUser(user.id)}
                                    style={{ marginLeft: 8 }}
                                >
                                    O'chirish
                                </Button>
                            </div>
                        ))}
                    </>
                </Modal>
            </div>
        </CustomLayout>
    );
};

export default FileManagement;








