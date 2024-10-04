import React, { useEffect, useState } from 'react';
import { Upload, Table, Select, notification, Button, message, Modal, Input, Pagination } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { getSprinters, addUserToSprinter, deleteUserFromSprinter } from '../../../api/spirinterAPI';
import CustomLayout from '../../../components/layout/Layout';
import * as XLSX from 'xlsx';
import './style.css';
import { createData, downloadDistrictZip, getAllDistricts, getUsers } from '../../../api/superAdminAPI';

const { Option } = Select;
const { Search } = Input;

function SprinterTable() {
    const [sprinters, setSprinters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [selectedSprinter, setSelectedSprinter] = useState(null);
    const [userIds, setUserIds] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [actionType, setActionType] = useState('add');
    const [data, setData] = useState([]);
    const [column, setColumns] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("all");
    const [selectedDistrictDel, setSelectedSprinterDel] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearchTerm] = useState("");
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    useEffect(() => {
        fetchDistricts();
        fetchSprinters();
        fetchUsers();
    }, []);


    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            setFilteredUsers(response?.data?.result?.filter((i) => i.role.name === "user") || []);
        } catch (error) {
            message.error('Foydalanuvchilarni olishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };


    // Sahifani yuklash funksiyasi
    const fetchSprinters = async (page = 1, per_page) => {
        setLoading(true);
        try {
            const data = await getSprinters({ page, per_page, search });
            setSprinters(data.result);
            setCurrentPage(page); // Joriy sahifani yangilash
        } catch (error) {
            console.error('Sprinterlarni olishda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };


    // Qidiruv funksiyasi
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        // Agar oldin timeout mavjud bo'lsa, uni tozalaymiz
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // 500ms kechikish bilan yangi so'rov yuboramiz
        const newTimeout = setTimeout(() => {
            fetchSprinters(1, 10, value);
        }, 500);

        // Yangi timeoutni saqlaymiz
        setDebounceTimeout(newTimeout);
    };



    const columnsUsers = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Ism / Familiya", dataIndex: "full_name", key: "full_name" },
        { title: "Telefon raqam", dataIndex: "phone_number", key: "phone_number" },
        {
            title: "Tumani",
            dataIndex: "district",
            key: "district",
            render: (text) => text?.name || 'Noma\'lum'
        },
    ];

    const handleViewMasters = (record) => {
        console.log(record);
        // Masalan, yangi modalni ochish va masterlar ro'yxatini ko'rsatish
        Modal.info({
            title: 'Biriktrilgan Masterlar Ro\'yxati',
            content: (
                <Table
                    columns={columnsUsers} // `customerColumns` ni kerakli kolonalar bilan almashtiring
                    dataSource={record?.mantiors} // `record.masters` to'g'ri ma'lumot manzilini ko'rsating
                    rowKey="id"
                    pagination={false}
                    size="small"
                    bordered={true}
                />
            ),
            onOk() { },
        });
    };


    const handleAddUser = async () => {
        try {
            await addUserToSprinter(selectedSprinter.id, userIds);
            message.success('Foydalanuvchi sprinterga qo\'shildi');
            setModalVisible(false);
        } catch (error) {
            message.error('Foydalanuvchini qo\'shishda xatolik yuz berdi');
        }
    };

    const handleDeleteUser = async () => {
        try {
            if (selectedUserId && selectedDistrictDel?.id) {
                await deleteUserFromSprinter(selectedDistrictDel.id, [selectedUserId]);
                message.success('Foydalanuvchi sprinterdan olib tashlandi');
                setDeleteModalVisible(false);
                setSelectedSprinterDel(null);
                fetchSprinters(); // Malumotlar yangilansin
            } else {
                message.warning('Iltimos foydalanuvchini tanlang');
            }
        } catch (error) {
            message.error('Foydalanuvchini olib tashlashda xatolik yuz berdi');
        }
    };

    const handleExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.id]);
        } else {
            setExpandedRowKeys([]);
        }
    };

    const handleDownloadQRCode = (url) => {
        // Yangi `<a>` elementi yaratamiz
        const link = document.createElement('a');
        link.href = url; // URL orqali tasvir manzilini beramiz
        link.download = 'qr-code.png'; // Fayl nomini beramiz
        link.target = '_blank'; // Yangi tabda ochilishi uchun qo'shimcha xavfsizlik chorasi
        link.click(); // Yuklashni boshlash
    };

    const sprinterColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Texnik Ma\'lumotlar', dataIndex: 'technical_data', key: 'technical_data' },
        {
            title: 'QR-Kod',
            key: 'qr_code',
            render: (text, record) => (
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadQRCode(record.qrCodeUrl)}
                >
                    Yuklab Olish
                </Button>
            ),
        },
        {
            title: 'Master biriktrish',
            key: 'actions',
            render: (text, record) => (
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setSelectedSprinter(record);
                        setActionType('add');
                        setModalVisible(true);
                    }}
                >
                    Master Qo'shish
                </Button>
            ),
        },
        {
            title: 'Masterni bekor qilish',
            key: 'delete_action',
            render: (text, record) => (
                <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                        setSelectedSprinterDel(record);
                        setDeleteModalVisible(true);
                    }}
                >
                    Masterni Olib Tashlash
                </Button>
            ),
        },
        {
            title: 'Biriktrilgan Masterlar Ro\'yxati',
            key: 'view_masters',
            render: (text, record) => (
                <Button
                    type="default"
                    icon={<SearchOutlined />}
                    onClick={() => handleViewMasters(record)}
                >
                    Masterlarni Ko\'rish
                </Button>
            ),
        },
    ];


    const fetchDistricts = async () => {
        try {
            const response = await getAllDistricts();
            setDistricts(response?.data || []);
        } catch (error) {
            message.error('Tumanlarni olishda xatolik yuz berdi');
        }
    };

    const customerColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Mijoz', dataIndex: 'subscriber', key: 'subscriber' },
        { title: 'Login', dataIndex: 'login', key: 'login' },
        { title: 'Port Nomer', dataIndex: 'port_number', key: 'port_number' },
        { title: 'Manzil', dataIndex: 'address', key: 'address' },
    ];

    const sendDataToServer = async () => {
        // Fayl hajmini tekshirish
        const fileSizeInBytes = data.size; // Fayl hajmini o'lchab olish
        const oneGBInBytes = 1024 * 1024 * 1024; // 1 GB ni baytlarda hisoblash

        if (fileSizeInBytes > oneGBInBytes) {
            notification.warning({ message: 'Fayl hajmi 1 GB dan oshmasligi kerak.' });
            return;
        }
        // Yuklanish holatini boshqarish
        setLoading(true); // Yuklanish animatsiyasini ishga tushirish
        try {
            await createData({ file: data });

            notification.success({ message: "Ma'lumotlar muvaffaqiyatli yuborildi!" });
            setData([]); // Ma'lumotlarni tozalash
        } catch (error) {
            console.error("Serverga ma'lumot jo'natishda xatolik:", error);
            notification.error({ message: "Ma'lumotlar jo'natishda xatolik yuz berdi." });
        } finally {
            setLoading(false); // Yuklanish holatini o'chirish
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



    const handleDownload = async () => {
        if (!selectedDistrict) {
            message.warning('Iltimos, tuman tanlang!');
            return;
        }

        setLoading(true);
        try {
            const response = await downloadDistrictZip(selectedDistrict);

            // Faylni yuklab olish
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `district_${selectedDistrict}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            message.success('ZIP fayli muvaffaqiyatli yuklandi');
        } catch (error) {
            message.error('ZIP faylini yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };


    // Sahifani o'zgartirishda ishlatiladigan funksiya
    const handlePageChange = (page) => {
        fetchSprinters(page, sprinters.per_page);
    };


    useEffect(() => {
        // Qidiruv maydoni bo'sh bo'lsa barcha sprinterlarni yuklash
        if (!search) {
            fetchSprinters();
        }
    }, [search]);
    // selectedDistrict

    // Check if selectedDistrict is "all" and return all data
    const result = selectedDistrict === "all"
        ? sprinters?.data
        : sprinters?.data?.filter(sprinter =>
            sprinter.mantiors?.some(mantior => mantior.district_id === selectedDistrict)
        );


    // If no matching district_id is found and selectedDistrict is not "all", show an empty array for "No data"
    const finalResult = result?.length > 0 ? result : [];



    return (
        <CustomLayout>
            <h2 style={{ textAlign: "center" }}>Splitterlar ro'yxati</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>


                <div style={{ display: 'flex', gap: "5px" }}>
                    <Select
                        style={{ width: 200, marginRight: 10 }}
                        placeholder="Tuman tanlang"
                        onChange={(value) => setSelectedDistrict(value)}
                        defaultValue="all"
                    >
                        <Option key="all" value="all">
                            Барча туманлар
                        </Option>
                        {districts.result?.map((district) => (
                            <Option key={district.id} value={district.id}>
                                {district.name}
                            </Option>
                        ))}
                    </Select>
                    {
                        selectedDistrict &&
                        <Button type="primary" onClick={handleDownload} loading={loading}>
                            ZIP faylini yuklash
                        </Button>
                    }
                </div>
                <Search
                    value={search}
                    onChange={handleSearch}
                    placeholder="Sprinterni texnik ma'lumotlari bo'yicha qidirish"
                    style={{ width: 450 }}
                />
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
            <div>
                <Table
                    columns={sprinterColumns}
                    dataSource={finalResult}
                    rowKey="id"
                    size="small"
                    loading={loading}
                    pagination={false}
                    bordered={true}
                    expandedRowKeys={expandedRowKeys}
                    onExpand={handleExpand}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Table
                                columns={customerColumns}
                                dataSource={record.customers}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                bordered={true}
                            />
                        ),
                        rowExpandable: (record) => record.customers && record.customers.length > 0,
                    }}
                />

                <div className='Pagination-main' style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", margin: "10px 0" }}>
                    <Pagination
                        current={currentPage}
                        total={sprinters.total} // Jami elementlar
                        pageSize={sprinters.per_page} // Bir sahifadagi elementlar
                        onChange={handlePageChange} // Sahifa o'zgarganda
                    />
                </div>


                <Modal
                    title={actionType === 'add' ? 'Foydalanuvchi Qo\'shish' : 'Foydalanuvchini Olib Tashlash'}
                    open={modalVisible}
                    onOk={actionType === 'add' ? handleAddUser : handleDeleteUser}
                    onCancel={() => setModalVisible(false)}
                >
                    <Select
                        showSearch
                        placeholder="Foydalanuvchini tanlang"
                        optionFilterProp="children"
                        onChange={(value) => setUserIds([value])} // Faqat bitta foydalanuvchi ID sini array shaklida saqlash
                        filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                        }
                        style={{ width: '100%' }}
                    >
                        {filteredUsers?.map((user) => (
                            <Option key={user.id} value={user.id}>
                                {user.full_name}
                            </Option>
                        ))}
                    </Select>
                </Modal>
                <Modal
                    title="Foydalanuvchini Olib Tashlash"
                    open={deleteModalVisible}
                    onOk={handleDeleteUser}
                    onCancel={() => setDeleteModalVisible(false)}
                >
                    <Select
                        showSearch
                        placeholder="Masterni tanlang"
                        style={{ width: '100%' }}
                        onChange={setSelectedUserId}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {selectedDistrictDel?.mantiors?.map((master) => (
                            <Option key={master.id} value={master.id}>
                                {master.full_name}
                            </Option>
                        ))}
                    </Select>
                </Modal>
            </div>
        </CustomLayout>
    );
}

export default SprinterTable;

















