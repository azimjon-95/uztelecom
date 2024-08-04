import React, { useEffect } from "react";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import useCRUD from "../../../hooks/useCRUD";
import CustomLayout from "../../../components/layout/Layout";

const Read = () => {
  const { data, loading, fetchData } = useCRUD("/user/get");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (record) => {
    navigate("/addForm", { state: { currentUser: record } });
  };

  //   const handleDelete = (id) => {
  //     deleteData(id).then(() => fetchData());
  //   };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Ism / Familiya", dataIndex: "full_name", key: "full_name" },
    { title: "Telefon raqam", dataIndex: "phone_number", key: "phone_number" },
    { title: "Role", dataIndex: "role", key: "role", render: (e) => e.name },
    {
      title: "Harakatlar",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            type="primary"
            style={{ marginRight: 8 }}
          >
            Tahrirlash
          </Button>
          <Button
            //   onClick={() => handleDelete(record.id)}
            type="danger"
          >
            O'chirish
          </Button>
        </>
      ),
    },
  ];

  return (
    <CustomLayout>
      <h2
        style={{
          textAlign: "center",
          color: "gray",
          lineHeight: "30px",
          marginTop: "10px",
        }}
      >
        Foydalanuvchilar Ro'yxati
      </h2>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          onClick={() => navigate("/addForm")}
          style={{ marginBottom: 16 }}
        >
          Foydalanuvchi Qo'shish
        </Button>
      </div>
      <Table
        pagination={false}
        size="small"
        columns={columns}
        dataSource={data.result}
        rowKey="id"
        loading={loading}
      />
    </CustomLayout>
  );
};

export default Read;
