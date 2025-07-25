import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../styles/Header.css";

const Header = ({ user, onLogout }) => {
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const [showMenu, setShowMenu] = useState(false);

    const handleToggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    const handleLogout = () => {
        setShowMenu(false); // Hide dropdown before logging out
        onLogout();
    };

    return (
        <header>
            <h2>Assignment 2</h2>

            <div>
                <div className="user-info" onClick={handleToggleMenu}>
                    <FaUserCircle className="user-icon" />
                    {isLoggedIn ? (
                        <span>{user?.name || "User"}</span>
                    ) : (
                        <a href="/login">
                            <span>Login</span>
                        </a>
                    )}
                </div>

                {showMenu && isLoggedIn && (
                    <div className="dropdown">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
