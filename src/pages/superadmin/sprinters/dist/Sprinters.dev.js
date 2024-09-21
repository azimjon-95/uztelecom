// import React, { useEffect, useState } from 'react';
// import { Upload, Table, Select, notification, Button, message, Modal, Input } from 'antd';
// import { UploadOutlined, PlusOutlined, DeleteOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
// import { getSprinters, addUserToSprinter, deleteUserFromSprinter } from '../../../api/spirinterAPI';
// import CustomLayout from '../../../components/layout/Layout';
// import * as XLSX from 'xlsx';
// import { createData, downloadDistrictZip, getAllDistricts, getUsers } from '../../../api/superAdminAPI';
// const { Option } = Select;
// function SprinterTable() {
//     const [sprinters, setSprinters] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [expandedRowKeys, setExpandedRowKeys] = useState([]);
//     const [selectedSprinter, setSelectedSprinter] = useState(null);
//     const [userIds, setUserIds] = useState([]);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [actionType, setActionType] = useState('add');
//     const [data, setData] = useState([]);
//     const [column, setColumns] = useState([]);
//     const [selectedDistrict, setSelectedDistrict] = useState(null);
//     const [districts, setDistricts] = useState([]);
//     const [filteredUsers, setFilteredUsers] = useState([]);
//     useEffect(() => {
//         fetchDistricts();
//         fetchSprinters();
//         fetchUsers();
//     }, []);
//     const fetchUsers = async () => {
//         try {
//             setLoading(true);
//             const response = await getUsers();
//             setFilteredUsers(response?.data?.result?.filter((i) => i.role.name === "user") || []);
//         } catch (error) {
//             message.error('Foydalanuvchilarni olishda xatolik yuz berdi');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const fetchSprinters = async () => {
//         setLoading(true);
//         try {
//             const data = await getSprinters();
//             setSprinters(data.result); // Sprinterlar ma'lumotlari olindi
//         } catch (error) {
//             message.error('Sprinterlarni olishda xatolik yuz berdi');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const columnsUsers = [
//         { title: "ID", dataIndex: "id", key: "id" },
//         { title: "Ism / Familiya", dataIndex: "full_name", key: "full_name" },
//         { title: "Telefon raqam", dataIndex: "phone_number", key: "phone_number" },
//     ];
//     const handleViewMasters = (record) => {
//         // Masalan, yangi modalni ochish va masterlar ro'yxatini ko'rsatish
//         Modal.info({
//             title: 'Biriktrilgan Masterlar Ro\'yxati',
//             content: (
//                 <Table
//                     columns={columnsUsers} // `customerColumns` ni kerakli kolonalar bilan almashtiring
//                     dataSource={record?.mantiors} // `record.masters` to'g'ri ma'lumot manzilini ko'rsating
//                     rowKey="id"
//                     pagination={false}
//                     size="small"
//                     bordered={true}
//                 />
//             ),
//             onOk() { },
//         });
//     };
//     const handleAddUser = async () => {
//         try {
//             await addUserToSprinter(selectedSprinter.id, userIds);
//             message.success('Foydalanuvchi sprinterga qo\'shildi');
//             setModalVisible(false);
//         } catch (error) {
//             message.error('Foydalanuvchini qo\'shishda xatolik yuz berdi');
//         }
//     };
//     const handleDeleteUser = async () => {
//         try {
//             await deleteUserFromSprinter(selectedSprinter.id, userIds);
//             message.success('Foydalanuvchi sprinterdan olib tashlandi');
//             setModalVisible(false);
//         } catch (error) {
//             message.error('Foydalanuvchini olib tashlashda xatolik yuz berdi');
//         }
//     };
//     const handleExpand = (expanded, record) => {
//         if (expanded) {
//             setExpandedRowKeys([record.id]);
//         } else {
//             setExpandedRowKeys([]);
//         }
//     };
//     const handleDownloadQRCode = (url) => {
//         // Yangi `<a>` elementi yaratamiz
//         const link = document.createElement('a');
//         link.href = url; // URL orqali tasvir manzilini beramiz
//         link.download = 'qr-code.png'; // Fayl nomini beramiz
//         link.target = '_blank'; // Yangi tabda ochilishi uchun qo'shimcha xavfsizlik chorasi
//         link.click(); // Yuklashni boshlash
//     };
//     const sprinterColumns = [
//         { title: 'ID', dataIndex: 'id', key: 'id' },
//         { title: 'Texnik Ma\'lumotlar', dataIndex: 'technical_data', key: 'technical_data' },
//         {
//             title: 'QR-Kod',
//             key: 'qr_code',
//             render: (text, record) => (
//                 <Button
//                     type="primary"
//                     icon={<DownloadOutlined />}
//                     onClick={() => handleDownloadQRCode(record.qrCodeUrl)}
//                 >
//                     Yuklab Olish
//                 </Button>
//             ),
//         },
//         {
//             title: 'Master biriktrish',
//             key: 'actions',
//             render: (text, record) => (
//                 <Button
//                     type="primary"
//                     icon={<PlusOutlined />}
//                     onClick={() => {
//                         setSelectedSprinter(record);
//                         setActionType('add');
//                         setModalVisible(true);
//                     }}
//                 >
//                     Foydalanuvchi Qo'shish
//                 </Button>
//             ),
//         },
//         {
//             title: 'Masterni bekor qilish',
//             key: 'actions',
//             render: (text, record) => (
//                 <Button
//                     type="danger"
//                     icon={<DeleteOutlined />}
//                     onClick={() => {
//                         setSelectedSprinter(record);
//                         setActionType('delete');
//                         setModalVisible(true);
//                     }}
//                 >
//                     Foydalanuvchini Olib Tashlash
//                 </Button>
//             ),
//         },
//         {
//             title: 'Biriktrilgan Masterlar Ro\'yxati',
//             key: 'view_masters',
//             render: (text, record) => (
//                 <Button
//                     type="default"
//                     icon={<SearchOutlined />}
//                     onClick={() => handleViewMasters(record)}
//                 >
//                     Masterlarni Ko\'rish
//                 </Button>
//             ),
//         },
//     ];
//     const fetchDistricts = async () => {
//         try {
//             const response = await getAllDistricts();
//             setDistricts(response?.data || []);
//         } catch (error) {
//             message.error('Tumanlarni olishda xatolik yuz berdi');
//         }
//     };
//     const customerColumns = [
//         { title: 'ID', dataIndex: 'id', key: 'id' },
//         { title: 'Mijoz', dataIndex: 'subscriber', key: 'subscriber' },
//         { title: 'Login', dataIndex: 'login', key: 'login' },
//         { title: 'Port Nomer', dataIndex: 'port_number', key: 'port_number' },
//         { title: 'Manzil', dataIndex: 'address', key: 'address' },
//     ];
//     const sendDataToServer = async () => {
//         console.log(data);
//         try {
//             const res = await createData({ file: data });
//             console.log(res);
//             notification.success({ message: 'Ma\'lumotlar muvaffaqiyatli yuborildi!' });
//             setData([]);
//         } catch (error) {
//             console.error("Serverga ma'lumot jo'natishda xatolik:", error);
//             notification.error({ message: 'Ma\'lumotlar jo\'natishda xatolik yuz berdi.' });
//         }
//     };
//     const handleFileUpload = async (info) => {
//         const file = info.file.originFileObj || info.file;
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             const binaryStr = e.target.result;
//             const workbook = XLSX.read(binaryStr, { type: "binary" });
//             const worksheetName = workbook.SheetNames[0];
//             const worksheet = workbook.Sheets[worksheetName];
//             const jsonData = XLSX.utils.sheet_to_json(worksheet);
//             if (jsonData?.length > 0) {
//                 const dynamicColumns = Object.keys(jsonData[0]);
//                 setColumns(dynamicColumns);
//             }
//             const dataWithInitialUserId = jsonData?.map((row) => ({
//                 ...row,
//             }));
//             setData(dataWithInitialUserId);
//         };
//         if (file) {
//             reader.readAsBinaryString(file);
//         }
//     };
//     const handleDownload = async () => {
//         if (!selectedDistrict) {
//             message.warning('Iltimos, tuman tanlang!');
//             return;
//         }
//         setLoading(true);
//         try {
//             const response = await downloadDistrictZip(selectedDistrict);
//             // Faylni yuklab olish
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `district_${selectedDistrict}.zip`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             message.success('ZIP fayli muvaffaqiyatli yuklandi');
//         } catch (error) {
//             message.error('ZIP faylini yuklashda xatolik yuz berdi');
//         } finally {
//             setLoading(false);
//         }
//     };
//     return (
//         <CustomLayout>
//             <h2 style={{ textAlign: "center" }}>Sprinterlar ro'yxati</h2>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
//                 <div style={{ display: 'flex', gap: "5px" }}>
//                     <Select
//                         style={{ width: 200, marginRight: 10 }}
//                         placeholder="Tuman tanlang"
//                         onChange={(value) => setSelectedDistrict(value)}
//                     >
//                         {districts.result?.map((district) => (
//                             <Option key={district.id} value={district.id}>
//                                 {district.name}
//                             </Option>
//                         ))}
//                     </Select>
//                     {
//                         selectedDistrict &&
//                         <Button type="primary" onClick={handleDownload} loading={loading}>
//                             ZIP faylini yuklash
//                         </Button>
//                     }
//                 </div>
//                 {data.length > 0 ?
//                     <Button onClick={sendDataToServer} type="primary" style={{ marginTop: 20 }}>Ma'lumotlarni Yuborish</Button>
//                     :
//                     <Upload beforeUpload={() => false} onChange={handleFileUpload} maxCount={1} accept=".xls,.xlsx">
//                         <Button icon={<UploadOutlined />}>Fayl yuklash</Button>
//                     </Upload>
//                 }
//             </div>
//             {data?.length > 0 && (
//                 <table className="data-table">
//                     <thead>
//                         <tr>
//                             {column.map((col) => (
//                                 <th key={col} style={{ border: "1px solid black", padding: 10 }}>
//                                     {col}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data?.map((row, rowIndex) => (
//                             <tr key={rowIndex}>
//                                 {column.map((col) => (
//                                     <td key={col} style={{ border: "1px solid black", padding: 10 }}>
//                                         {row[col]}
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//             <div>
//                 <Table
//                     columns={sprinterColumns}
//                     dataSource={sprinters}
//                     rowKey="id"
//                     size="small"
//                     loading={loading}
//                     pagination={false}
//                     bordered={true}
//                     expandedRowKeys={expandedRowKeys}
//                     onExpand={handleExpand}
//                     expandable={{
//                         expandedRowRender: (record) => (
//                             <Table
//                                 columns={customerColumns}
//                                 dataSource={record.customers}
//                                 rowKey="id"
//                                 pagination={false}
//                                 size="small"
//                                 bordered={true}
//                             />
//                         ),
//                         rowExpandable: (record) => record.customers && record.customers.length > 0,
//                     }}
//                 />
//                 <Modal
//                     title={actionType === 'add' ? 'Foydalanuvchi Qo\'shish' : 'Foydalanuvchini Olib Tashlash'}
//                     open={modalVisible}
//                     onOk={actionType === 'add' ? handleAddUser : handleDeleteUser}
//                     onCancel={() => setModalVisible(false)}
//                 >
//                     <Input
//                         placeholder="Foydalanuvchi ID larini kiriting (vergul bilan ajratilgan)"
//                         onChange={(e) => setUserIds(e.target.value.split(','))}
//                     />
//                 </Modal>
//             </div>
//         </CustomLayout>
//     );
// }
// export default SprinterTable;
"use strict";