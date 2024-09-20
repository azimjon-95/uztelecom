import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, Form, Select, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomLayout from '../../../components/layout/Layout';
import {
  getUsers,
  getAllDistricts,
  createUser,
  getRoles,
  deleteUser,
  updateUser, // Import `updateUser` function
} from '../../../api/superAdminAPI';
import './style.css'
const { Option } = Select;

function Read() {
  const [form] = Form.useForm();
  const [openBox, setOpenBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);


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
      message.error('Foydalanuvchilarni olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await getAllDistricts();
      setDistricts(response?.data || []);
    } catch (error) {
      message.error('Tumanlarni olishda xatolik yuz berdi');
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response?.data || []);
    } catch (error) {
      message.error('Rollarni olishda xatolik yuz berdi');
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
      message.error('User yaratishda xatolik yuz berdi');
    }
  };

  const handleUpdateUser = async (values) => {
    console.log(values);
    try {
      if (currentUser) {
        await updateUser({ ...values, id: currentUser.id });
        message.success('Foydalanuvchi muvaffaqiyatli yangilandi');
        form.resetFields();
        setOpenBox(false);
        fetchUsers();
      }
    } catch (error) {
      message.error('Foydalanuvchini yangilashda xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteUser(id);
      message.success("Foydalanuvchi muvaffaqiyatli o'chirildi");
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      message.error("Foydalanuvchini o'chirishda xatolik yuz berdi");
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
        if (role.name === "user") return "Hodim";
        return role.name;
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
    handleRoleFilter(value);
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

  return (
    <CustomLayout>
      <div style={{ width: "100%", height: "98vh", position: "relative", overflow: "hidden" }}>
        <h2 style={{ textAlign: 'center', color: 'gray', marginTop: '10px' }}>Super Admin Paneli</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Select
            placeholder="Rolni tanlang"
            onChange={handleRoleChange}
            style={{ width: 200 }}
          >
            {/* {roles?.result?.map((role) => ( */}
            {roles?.result
              ?.filter((role) => role.name !== 'super_admin') // "super_admin" ni chiqarib tashlaymiz
              .map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {{
                    super_admin: "Super Admin",
                    admin: "Admin",
                    user: "Hodimlar",
                  }[role.name] || role.name}
                </Select.Option>
              ))}
          </Select>

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
          dataSource={filteredData?.filter((user) => user.role.name !== 'super_admin')} // Faqat "super_admin" emaslarni ko'rsatamiz
          rowKey="id"
          loading={loading}
          bordered
          scroll={{ y: 500 }}
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
              <Select placeholder="Rolni tanlang">
                {roles?.result?.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="district_id"
              label="Tuman"
              rules={[{ required: true, message: 'Tumanni tanlang' }]}
            >
              <Select placeholder="Tumanni tanlang">
                {districts.result?.map((district) => (
                  <Select.Option key={district.id} value={district.id}>
                    {district.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

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



export default Read;



