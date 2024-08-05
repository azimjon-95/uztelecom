import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, Select, Col, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import useCRUD from "../../../hooks/useCRUD";
import "./style.css";
import CustomLayout from "../../../components/layout/Layout";
import { ArrowLeftOutlined } from "@ant-design/icons";

const Read = () => {
  const { data, loading, fetchData } = useCRUD("/user/get");
  const { updateData } = useCRUD("/users");
  const { createData, error } = useCRUD("/auth/register");
  const navigate = useNavigate();
  const [openBox, setOpenBox] = useState(false);
  const location = useLocation();
  const [form] = Form.useForm();
  const currentUser = location.state?.currentUser || null;
  const [isEdit, setIsEdit] = useState(false); // State for edit mode

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(currentUser);
      setIsEdit(true); // Set edit mode to true
      setOpenBox(true);
    }
  }, [isEdit, currentUser, form]);

  useEffect(() => {
    fetchData();
  }, []);


  const onFinish = (values) => {
    const action = isEdit ? updateData(currentUser.id, values) : createData(values);

    action
      .then((res) => {
        if (res?.data?.result) {
          message.success(isEdit ? "Ma'lumotlar muvaffaqiyatli yangilandi!" : "Foydalanuvchi muvaffaqiyatli qo'shildi!");
          setOpenBox(false);
          form.resetFields();
          fetchData();
        } else {
          message.error(error?.response?.data?.message || "Xatolik yuz berdi!");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || "Xatolik yuz berdi!");
      });
  };


  const handleBack = () => {
    setOpenBox(false);
    form.resetFields();
    setIsEdit(false); // Reset edit mode on back
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsEdit(true); // Set edit mode to true
    setOpenBox(true);
  };


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
          <Button type="danger">O'chirish</Button>
        </>
      ),
    },
  ];

  return (
    <CustomLayout>
      <h2 style={{ textAlign: "center", color: "gray", lineHeight: "30px", marginTop: "10px" }}>
        Foydalanuvchilar Ro'yxati
      </h2>
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Button type="primary" onClick={() => {
          setIsEdit(false); // Set edit mode to false for new user
          setOpenBox(true);
        }} style={{ marginBottom: 16 }}>
          Foydalanuvchi Qo'shish
        </Button>
      </div>
      <Table
        pagination={false}
        size="small"
        columns={columns}
        dataSource={data?.result}
        rowKey="id"
        loading={loading}
      />
      {openBox && (
        <div className="edi_banner">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <h2 style={{ textAlign: "center", color: "gray", lineHeight: "30px", marginTop: "10px" }}>
              {isEdit ? "Ma'lumotlarni yangilash" : "Ishchilarni Qabul qilish"}
            </h2>
            <Col style={{ width: "100%" }}>
              <Form.Item style={{ width: "100%" }}
                name="full_name"
                label="Ism"
                rules={[{ required: true, message: "Ism va Familiya kiriting!" }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col style={{ width: "100%" }}>
              <Form.Item style={{ width: "100%" }}
                name="phone_number"
                label="Telefon raqam"
                rules={[{ required: true, message: "Telefon raqam kiriting!" }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col style={{ width: "100%" }}>
              <Form.Item style={{ width: "100%" }}
                name="password"
                label="Password"
                rules={[{ required: !isEdit, message: "Parol kiriting!" }]}
              >
                <Input.Password disabled={isEdit} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Role kiriting!" }]}
              >
                <Select
                  options={[
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "User" },
                  ]}
                />
              </Form.Item>
            </Col>
            <div style={{ width: "100%", display: "flex", gap: "5px" }}>
              <Button style={{ width: "100%" }} type="primary" htmlType="submit">
                {isEdit ? "Yangilash" : "Roʻyxatdan oʻtish"}
              </Button>
              <Button
                type="default"
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                style={{ marginLeft: 8 }}
              >
                Orqaga
              </Button>
            </div>
          </Form>
        </div>
      )}
    </CustomLayout>
  );
};

export default Read;


// import React, { useEffect, useState } from "react";
// import { Table, Button, Form, Input, Select, Col, message } from "antd";
// import { useNavigate, useLocation } from "react-router-dom";
// import useCRUD from "../../../hooks/useCRUD";
// import "./style.css";
// import CustomLayout from "../../../components/layout/Layout";
// import { ArrowLeftOutlined } from "@ant-design/icons";

// const Read = () => {
//   const { data, loading, fetchData } = useCRUD("/user/get");
//   const { updateData } = useCRUD("/users");
//   const { createData, error } = useCRUD("/auth/register");
//   const navigate = useNavigate();
//   const [openBox, setOpenBox] = useState(false);
//   const [isEdit, setIsEdit] = useState(false); // State for edit mode
//   const location = useLocation();
//   const [form] = Form.useForm();
//   const currentUser = location.state?.currentUser || null;

//   useEffect(() => {
//     if (isEdit) {
//       form.setFieldsValue(currentUser);
//       setIsEdit(true); // Set edit mode to true
//       setOpenBox(true);
//     }
//   }, [isEdit, currentUser, form]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);


//   const onFinish = (values) => {
//     const action = isEdit ? updateData(currentUser.id, values) : createData(values);

//     action
//       .then((res) => {
//         if (res?.data?.result) {
//           message.success(isEdit ? "Ma'lumotlar muvaffaqiyatli yangilandi!" : "Foydalanuvchi muvaffaqiyatli qo'shildi!");
//           setOpenBox(false);
//           form.resetFields();
//           fetchData();
//         } else {
//           message.error(error?.response?.data?.message || "Xatolik yuz berdi!");
//         }
//       })
//       .catch((err) => {
//         message.error(err?.response?.data?.message || "Xatolik yuz berdi!");
//       });
//   };

//   const handleBack = () => {
//     setOpenBox(false);
//     form.resetFields();
//     setIsEdit(false); // Reset edit mode on back
//   };

//   const handleEdit = (record) => {
//     form.setFieldsValue(record);
//     setIsEdit(true); // Set edit mode to true
//     setOpenBox(true);
//   };

//   const columns = [
//     { title: "ID", dataIndex: "id", key: "id" },
//     { title: "Ism / Familiya", dataIndex: "full_name", key: "full_name" },
//     { title: "Telefon raqam", dataIndex: "phone_number", key: "phone_number" },
//     { title: "Role", dataIndex: "role", key: "role", render: (e) => e.name },
//     {
//       title: "Harakatlar",
//       key: "action",
//       render: (text, record) => (
//         <>
//           <Button
//             onClick={() => handleEdit(record)}
//             type="primary"
//             style={{ marginRight: 8 }}
//           >
//             Tahrirlash
//           </Button>
//           <Button type="danger">O'chirish</Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <CustomLayout>
//       <h2 style={{ textAlign: "center", color: "gray", lineHeight: "30px", marginTop: "10px" }}>
//         Foydalanuvchilar Ro'yxati
//       </h2>
//       <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
//         <Button type="primary" onClick={() => {
//           setIsEdit(false); // Set edit mode to false for new user
//           setOpenBox(true);
//         }} style={{ marginBottom: 16 }}>
//           Foydalanuvchi Qo'shish
//         </Button>
//       </div>
//       <Table
//         pagination={false}
//         size="small"
//         columns={columns}
//         dataSource={data?.result}
//         rowKey="id"
//         loading={loading}
//       />
//       {openBox && (
//         <div className="edi_banner">
//           <Form form={form} layout="vertical" onFinish={onFinish}>
//             <h2 style={{ textAlign: "center", color: "gray", lineHeight: "30px", marginTop: "10px" }}>
//               {isEdit ? "Ma'lumotlarni yangilash" : "Ishchilarni Qabul qilish"}
//             </h2>
//             <Col style={{ width: "100%" }}>
//               <Form.Item style={{ width: "100%" }}
//                 name="full_name"
//                 label="Ism"
//                 rules={[{ required: true, message: "Ism va Familiya kiriting!" }]}
//               >
//                 <Input style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>
//             <Col style={{ width: "100%" }}>
//               <Form.Item style={{ width: "100%" }}
//                 name="phone_number"
//                 label="Telefon raqam"
//                 rules={[{ required: true, message: "Telefon raqam kiriting!" }]}
//               >
//                 <Input style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>
//             <Col style={{ width: "100%" }}>
//               <Form.Item style={{ width: "100%" }}
//                 name="password"
//                 label="Password"
//                 rules={[{ required: !isEdit, message: "Parol kiriting!" }]}
//               >
//                 <Input.Password disabled={isEdit} />
//               </Form.Item>
//             </Col>
//             <Col>
//               <Form.Item
//                 label="Role"
//                 name="role"
//                 rules={[{ required: true, message: "Role kiriting!" }]}
//               >
//                 <Select
//                   options={[
//                     { value: "admin", label: "Admin" },
//                     { value: "user", label: "User" },
//                   ]}
//                 />
//               </Form.Item>
//             </Col>
//             <div style={{ width: "100%", display: "flex", gap: "5px" }}>
//               <Button style={{ width: "100%" }} type="primary" htmlType="submit">
//                 {isEdit ? "Yangilash" : "Roʻyxatdan oʻtish"}
//               </Button>
//               <Button
//                 type="default"
//                 icon={<ArrowLeftOutlined />}
//                 onClick={handleBack}
//                 style={{ marginLeft: 8 }}
//               >
//                 Orqaga
//               </Button>
//             </div>
//           </Form>
//         </div>
//       )}
//     </CustomLayout>
//   );
// };

// export default Read;
