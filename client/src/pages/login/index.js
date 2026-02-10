import React, { useEffect } from "react";
import { Form, message } from "antd";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { Loginuser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
       dispatch(ShowLoading())
      const response = await Loginuser(values);
       dispatch(HideLoading())

      if (response.success) {
        message.success(response.message);

        // ✅ FIX: token was in response.token (not response.data)
        localStorage.setItem("token", response.token);

        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading())
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  return (
  <div className="login-page">
    <div className="login-card">
      <h1 className="login-title center-title">🎬Movie<span>Mint</span></h1><br/>
      <p className="login-subtitle">Book movies. Experience cinema.</p>

      <Form layout="vertical" className="mt-2 auth-form" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <input type="email" className="auth-input" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <input type="password" className="auth-input" />
        </Form.Item>

        <div className="auth-actions">
          <Button fullwidth title="Login" htmlType="submit" />
          <Link to="/register" className="auth-link">
            Don’t have an account? Register
          </Link>
        </div>
      </Form>
    </div>
  </div>
);

}

export default Login;

