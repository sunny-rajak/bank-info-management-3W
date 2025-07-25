import React, { useState } from "react";
import axios from "../axiosConfig";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        isAdmin: false,
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/auth/register", formData);
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
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
                    <label>
                        <input
                            type="checkbox"
                            name="isAdmin"
                            onChange={handleChange}
                        />
                        Register as Admin
                    </label>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
