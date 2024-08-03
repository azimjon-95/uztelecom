import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useCRUD from '../../../hooks/useCRUD';

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
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button onClick={() => handleEdit(record)} type="primary" style={{ marginRight: 8 }}>Edit</Button>
                    <Button onClick={() => handleDelete(record.id)} type="danger">Delete</Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <h1>User List</h1>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Add User</Button>
            <Table pagination={false} size="small" columns={columns} dataSource={data} rowKey="id" loading={loading} />
        </div>
    );
};

export default Read;





