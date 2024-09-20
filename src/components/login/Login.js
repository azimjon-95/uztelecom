import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Form, Input, Button, message } from "antd";
import { signIn } from "../../api/superAdminAPI"; // `useCRUD` hookni import qiling
import "./style.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);


  // URL dan ID ni olish
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idFromUrl = queryParams.get('id');
    if (idFromUrl) {
      setId(idFromUrl);
    }
  }, [location.search]);


  const onFinish = async (values) => {
    setLoading(true);

    // Telefon raqamini formatlash
    const formattedPhoneNumber = values.phone_number.replace("+", "");
    values.phone_number = formattedPhoneNumber;

    try {
      // Kirish funksiyasini chaqiramiz
      const response = await signIn(values);

      // Foydalanuvchining rolini tekshiramiz
      if (response?.result?.role?.name === "admin") {
        // Admin uchun navigatsiya
        navigate("/fileManagement");
      } else {
        // Oddiy foydalanuvchi yoki fayl skan qilish sahifasiga yo'naltirish
        if (id) {
          navigate(`/scan/${id}`);
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      // Xatolikni qayta ishlash
      const errorMessage = "Login jarayonida xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.";
      message.error(errorMessage);
    } finally {
      // Yuklanishni tugatish
      setLoading(false);
    }
  };


  return (
    <div className="login_BODY">
      <div className="login_container">
        <div className="login-box">
          <h2>KIRISH</h2>
          <p></p>
          <Form
            name="login"
            onFinish={onFinish}
            style={{ maxWidth: "300px", margin: "auto", marginTop: "50px" }}
          >
            <div className="textbox">
              <Form.Item
                name="phone_number"
                rules={[
                  {
                    required: true,
                    message: "Iltimos, Telefon raqamingizni kiriting!",
                  },
                ]}
              >
                <PhoneInput
                  defaultCountry="uz"
                  value={phone}
                  onChange={(e) => e.length === 13 && setPhone(e)}
                  inputStyle={{ width: "100%" }}
                  className="PhoneInput"
                  placeholder="+998 xx xxx-xx-xx"
                />
              </Form.Item>
            </div>
            <div className="textbox">
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Iltimos, Parolingizni kiriting!",
                  },
                ]}
              >
                <Input.Password placeholder="Parol" />
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                style={{
                  width: "100%",
                  marginTop: "4px",
                  backgroundColor: "#03B4FF",
                }}
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Kirish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
