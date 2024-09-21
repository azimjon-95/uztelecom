import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Form, Input, Button, message } from "antd";
import { signIn } from "../../api/superAdminAPI";
import "./style.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // URL dan file_id ni olish
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idFromUrl = queryParams.get('file_id'); // file_id ni olib keling
    if (idFromUrl) {
      setId(idFromUrl);
    }
  }, [location.search]);



  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Telefon raqamini formatlash (bo'shliqlarni olib tashlash va "+" belgisini almashtirish)
      values.phone_number = values.phone_number.trim().replace("+", "");

      const response = await signIn(values);
      const userRole = response?.result?.role?.name;

      // User roli tekshiruvi va navigatsiya
      if (userRole === "admin" || userRole === "super_admin") {
        navigate("/");
      } else {
        navigate(id ? `/scan/${id}` : "/");
      }
    } catch (err) {
      message.error("Login jarayonida xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
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
                rules={[{ required: true, message: "Iltimos, Telefon raqamingizni kiriting!" }]}
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
                rules={[{ required: true, message: "Iltimos, Parolingizni kiriting!" }]}
              >
                <Input.Password placeholder="Parol" />
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                style={{ width: "100%", marginTop: "4px", backgroundColor: "#03B4FF" }}
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



