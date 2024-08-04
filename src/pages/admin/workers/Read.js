import React, { useEffect } from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import useCRUD from '../../../hooks/useCRUD';
import CustomLayout from '../../../components/layout/Layout';

const Read = () => {
    const { data, loading, fetchData, deleteData } = useCRUD('/users');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        navigate('/addForm');
    };

    const handleEdit = (record) => {
        navigate('/addForm', { state: { currentUser: record } });
    };

    const handleDelete = (id) => {
        deleteData(id).then(() => fetchData());
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Ism', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Harakatlar',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button onClick={() => handleEdit(record)} type="primary" style={{ marginRight: 8 }}>Tahrirlash</Button>
                    <Button onClick={() => handleDelete(record.id)} type="danger">O'chirish</Button>
                </>
            ),
        },
    ];

    return (
        <CustomLayout>
            <h2 style={{ textAlign: "center", color: "gray", lineHeight: "30px", marginTop: "10px" }}>Foydalanuvchilar Ro'yxati</h2>
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Foydalanuvchi Qo'shish</Button>
            </div>
            <Table pagination={false} size="small" columns={columns} dataSource={data} rowKey="id" loading={loading} />
        </CustomLayout>
    );
};

export default Read;





