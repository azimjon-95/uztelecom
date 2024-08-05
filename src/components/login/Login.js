import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Form, Input, Button, message } from "antd";
import useCRUD from "../../hooks/useCRUD"; // `useCRUD` hookni import qiling
import "./style.css";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useCRUD("/auth/login"); // API endpoint
  const [phone, setPhone] = useState("");

  const onFinish = async (values) => {
    // Telefon raqamini formatlash
    const formattedPhoneNumber = values.phone_number.replace("+", "");
    values.phone_number = formattedPhoneNumber;


    try {
      const response = await signIn(values);
      if (response?.result?.role?.name === "admin") {
        // Admin uchun navigatsiya
        navigate("/abonents/admin");
      } else {
        // Oddiy foydalanuvchi uchun navigatsiya
        navigate("/abonents");
      }
    } catch (err) {
      // Xatolikni qayta ishlash
      const errorMessage = err?.response?.data?.result || "Noma'lum xatolik yuz berdi";
      message.error(errorMessage);
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
