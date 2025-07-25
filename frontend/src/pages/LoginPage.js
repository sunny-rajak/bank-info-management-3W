import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/auth/login", formData);

            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.isAdmin) {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login failed.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
