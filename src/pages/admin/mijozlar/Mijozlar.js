import React from 'react';
import { Table } from 'antd';
import CustomLayout from '../../../components/layout/Layout';

// Jadval uchun ustunlar
const columns = [
    {
        title: 'Ism',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Telefon Raqami',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Manzil',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Ro‘yxatdan o‘tgan sana',
        dataIndex: 'registrationDate',
        key: 'registrationDate',
    },
];

// Jadval uchun ma'lumotlar
const data = [
    {
        key: '1',
        name: 'Ali Valiyev',
        phone: '+998901234567',
        address: 'Toshkent, Chilonzor',
        email: 'ali@example.com',
        registrationDate: '2023-01-15',
    },
    {
        key: '2',
        name: 'Xusan Karimov',
        phone: '+998907654321',
        address: 'Samarqand, Bulungur',
        email: 'xusan@example.com',
        registrationDate: '2023-02-20',
    },
    {
        key: '3',
        name: 'Nigora Usmonova',
        phone: '+998933332222',
        address: 'Andijon, Asaka',
        email: 'nigora@example.com',
        registrationDate: '2023-03-10',
    },
    {
        key: '4',
        name: 'Bekzod Saidov',
        phone: '+998941234567',
        address: 'Buxoro, Kogon',
        email: 'bekzod@example.com',
        registrationDate: '2023-04-05',
    },
    {
        key: '5',
        name: 'Gulnora Rasulova',
        phone: '+998999876543',
        address: 'Namangan, Uchqo‘rg‘on',
        email: 'gulnora@example.com',
        registrationDate: '2023-05-30',
    },
];

const Mijozlar = () => {
    return (
        <CustomLayout>
            <div style={{ padding: 5 }}>
                <h2 style={{ textAlign: "center", color: "gray", lineHeight: "30px", marginTop: "10px" }}>Abonentlar</h2>
                <Table columns={columns} dataSource={data} />
            </div>
        </CustomLayout>
    );
};

export default Mijozlar;
