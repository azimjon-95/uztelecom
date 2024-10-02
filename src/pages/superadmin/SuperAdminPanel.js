import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Form, Select, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomLayout from '../../components/layout/Layout';
import api from '../../api/index';

import {
    getUsers,
    getAllDistricts,
    createUser,
    getRoles,
    deleteUser,
    updateUser, // Import `updateUser` function
} from '../../api/superAdminAPI';
const { Option } = Select;
const { Search } = Input;

function SuperAdminPanel() {
    const [form] = Form.useForm();
    const [openBox, setOpenBox] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [roles, setRoles] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [rolesValue, setRolesValue] = useState(null);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        fetchUsers();
        fetchDistricts();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            setData(response?.data?.result || []);
            setFilteredData(response?.data?.result || []);
        } catch (error) {
            console.error('Foydalanuvchilarni olishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const fetchDistricts = async () => {
        try {
            const response = await getAllDistricts();

            setDistricts(response?.data || []);
        } catch (error) {
            console.error('Tumanlarni olishda xatolik yuz berdi');
        }
    };

    // Eski tokenni o'chirish va yangi tokenni saqlash
    const refreshAuthToken = async () => {
        try {
            const response = await api.post('/auth/refresh');
            const newToken = response.data.newToken || '';
            // const { token } = response?.data?.result;

            // Eski tokenni o'chirish va yangi tokenni saqlash
            localStorage.removeItem('token');
            localStorage.setItem('token', newToken);

            message.success('Token muvaffaqiyatli yangilandi.');
        } catch (error) {
            message.warning('Tokenni yangilashda xatolik yuz berdi.');
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await getRoles();

            setRoles(response?.data || []);
        } catch (error) {
            console.error('Rollarni olishda xatolik yuz berdi');
        }
    };

    const handleCreateUser = async (values) => {
        try {
            await createUser(values);
            message.success('User muvaffaqiyatli yaratildi');
            form.resetFields();
            setOpenBox(false);
            fetchUsers();
        } catch (error) {
            console.error('User yaratishda xatolik yuz berdi');
        }
    };

    const handleUpdateUser = async (values) => {
        try {
            if (currentUser) {
                await updateUser({ ...values, id: currentUser.id });
                message.success('Foydalanuvchi muvaffaqiyatli yangilandi');
                form.resetFields();
                setOpenBox(false);
                fetchUsers();
            }
        } catch (error) {
            console.error('Foydalanuvchini yangilashda xatolik yuz berdi');
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await deleteUser(id);
            message.success("Foydalanuvchi muvaffaqiyatli o'chirildi");
            setData((prevData) => prevData.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Foydalanuvchini o'chirishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const showDeleteConfirm = (id) => {
        Modal.confirm({
            title: "Foydalanuvchini o'chirishni tasdiqlaysizmi?",
            content: "Bu amal qaytarilmaydi, o'chirilgan foydalanuvchi ma'lumotlari qayta tiklanmaydi.",
            okText: "Ha, o'chirish",
            okType: "danger",
            cancelText: "Bekor qilish",
            onOk() {
                handleDelete(id);
            },
            onCancel() {
                console.log("O'chirish bekor qilindi");
            },
        });
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Ism / Familiya", dataIndex: "full_name", key: "full_name" },
        { title: "Telefon raqam", dataIndex: "phone_number", key: "phone_number" },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => {
                if (role.name === "super_admin") return "Super Admin";
                if (role.name === "admin") return "Admin";
                if (role.name === "user") return "Hodimlar";
                return role.name;
            },
        },
        {
            title: "Tumani", dataIndex: "district", key: "district",
            render: (district) => {
                return district.name;
            },
        },

        {
            title: "Tahrirlash",
            key: "action",
            render: (text, record) => (
                <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => {
                        setCurrentUser(record);
                        form.setFieldsValue({
                            full_name: record.full_name,
                            phone_number: record.phone_number,
                            role_id: record.role.id,
                            district_id: record.district_id || '',
                        });
                        setIsEdit(true);
                        setOpenBox(true);
                    }}
                >
                    <EditOutlined />
                </Button>
            ),
        },
        {
            title: "O'chirish",
            key: "action",
            render: (text, record) => (
                <Button type="danger" onClick={() => showDeleteConfirm(record.id)}>
                    <DeleteOutlined />
                </Button>
            ),
        },
    ];

    const handleRoleChange = (value) => {
        if (value === "all") {
            setFilteredData(data); // Agar "Barchasi" tanlansa, barcha userlarni ko'rsatish
        } else {
            handleRoleFilter(value); // Muayyan rol asosida filtrlash
        }
    };

    const handleRoleFilter = (roleId) => {
        const filtered = data.filter((user) => user.role.id === roleId);
        setFilteredData(filtered);
    };

    const handleBack = () => {
        setOpenBox(false);
        form.resetFields();
        setIsEdit(false);
        setCurrentUser(null);
    };

    // Qidirish funksiyasi
    const handleSearchInput = (value) => {
        setSearchValue(value.toLowerCase()); // Qidirilayotgan qiymatni saqlash
    };

    // Sprinters ma'lumotlarini qidirishdan so'ng filtrlaymiz
    const filteredSprinters = filteredData?.filter((sprinter) =>
        sprinter.full_name?.toLowerCase().includes(searchValue) // 'technical_data' ichida 'searchValue' qiymatini qidirish
    );

    return (
        <CustomLayout>
            <div style={{ width: "100%", minHeight: "98vh", position: "relative", overflow: "hidden" }}>
                <h2 style={{ textAlign: 'center', color: 'gray', marginTop: '10px' }}>Super Admin Paneli</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Select
                        placeholder="Rolni tanlang"
                        onChange={handleRoleChange}
                        style={{ width: 200 }}
                    // defaultValue="all"  // Sukut bo‘yicha "Barchasi" tanlanadi
                    >
                        <Select.Option key="all" value="all">
                            Barchasi
                        </Select.Option>
                        {roles?.result?.map((role) => (
                            <Select.Option key={role.id} value={role.id}>
                                {{
                                    super_admin: "Super Admin",
                                    admin: "Admin",
                                    user: "Hodimlar",
                                }[role.name] || role.name}
                            </Select.Option>
                        ))}
                    </Select>


                    <Button onClick={refreshAuthToken} type='primary'>
                        Tokenni Yangilash
                    </Button>


                    {/* // search */}
                    <Search
                        value={searchValue}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        placeholder="Hodimlarni ism familyasi bo'yicha qidirish..."
                        style={{ width: 450 }}
                    />

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsEdit(false);
                            setOpenBox(true);
                        }}
                    >
                        Foydalanuvchi Qo'shish
                    </Button>
                </div>
                <Table
                    pagination={false}
                    size="small"
                    columns={columns}
                    dataSource={filteredSprinters}
                    rowKey="id"
                    loading={loading}
                    bordered
                />



                <div className={`${openBox ? 'edi_banner' : 'edi_banner-block'}`}>
                    <Form form={form} onFinish={isEdit ? handleUpdateUser : handleCreateUser} layout="vertical">
                        <h2 style={{ textAlign: 'center', color: 'gray', marginTop: '10px' }}>
                            {isEdit ? "Ma'lumotlarni yangilash" : "Ishchilarni Qabul qilish"}
                        </h2>
                        <Form.Item
                            name="full_name"
                            label="To'liq Ism"
                            rules={[{ required: true, message: 'To\'liq ismni kiriting' }]}
                        >
                            <Input placeholder="To'liq Ism" />
                        </Form.Item>
                        <Form.Item
                            name="phone_number"
                            label="Telefon Raqam"
                            rules={[{ required: true, message: 'Telefon raqamni kiriting' }]}
                        >
                            <Input placeholder="Telefon Raqam" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Parol"
                            rules={[{ required: true, message: 'Parolni kiriting' }]}
                        >
                            <Input placeholder="Parol" />
                        </Form.Item>

                        <Form.Item
                            name="role_id"
                            label="Rol"
                            rules={[{ required: true, message: 'Rolni tanlang' }]}
                        >
                            <Select placeholder="Rolni tanlang" onChange={(value) => setRolesValue(value)}>
                                {roles?.result?.map((role) => (
                                    <Option key={role.id} value={role.id}>
                                        {role.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {rolesValue === 2 || rolesValue === 3 ? (
                            <Form.Item
                                name="district_id"
                                label="Tuman"
                                rules={[{ required: false, message: 'Tumanni tanlang' }]}
                            >
                                <Select placeholder="Tumanni tanlang">
                                    {districts.result?.map((district) => (
                                        <Select.Option key={district.id} value={district.id}>
                                            {district.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : null}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {isEdit ? 'Yangilash' : 'Qo\'shish'}
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={handleBack}>
                                <ArrowLeftOutlined /> Ortga
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </CustomLayout>
    );
}

export default SuperAdminPanel;





