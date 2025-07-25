import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [filters, setFilters] = useState({
        username: "",
        email: "",
        ifscCode: "",
        bankName: "",
    });
    const [accounts, setAccounts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [loading, setLoading] = useState(false);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams({
                ...filters,
                page,
                limit,
            }).toString();

            const token = localStorage.getItem("token");

            const res = await axios.get(`/admin/accounts?${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched accounts:", res.data);
            setAccounts(res.data.accounts);
        } catch (err) {
            console.error("Error fetching accounts:", err);
            alert("Failed to fetch accounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
        // eslint-disable-next-line
    }, [filters, page]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this account?"))
            return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/admin/accounts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Account deleted successfully");
            fetchAccounts(); // refresh list
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete account");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPage(1); // reset to first page on filter change
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            <div className="filters">
                <input
                    name="username"
                    placeholder="Search Username"
                    onChange={handleInputChange}
                    value={filters.username}
                />
                <input
                    name="email"
                    placeholder="Search Email"
                    onChange={handleInputChange}
                    value={filters.email}
                />
                <input
                    name="ifscCode"
                    placeholder="Search IFSC"
                    onChange={handleInputChange}
                    value={filters.ifscCode}
                />
                <input
                    name="bankName"
                    placeholder="Search Bank"
                    onChange={handleInputChange}
                    value={filters.bankName}
                />
            </div>

            {loading ? (
                <p>Loading accounts...</p>
            ) : (
                <table border="1" cellPadding="8" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Bank</th>
                            <th>IFSC</th>
                            <th>Account Number</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.length === 0 ? (
                            <tr>
                                <td colSpan="6">No accounts found.</td>
                            </tr>
                        ) : (
                            accounts.map((acc) => (
                                <tr key={acc._id}>
                                    <td data-label="User">
                                        {acc.user?.username}
                                    </td>
                                    <td data-label="Email">
                                        {acc.user?.email}
                                    </td>
                                    <td data-label="Bank">{acc.bankName}</td>
                                    <td data-label="IFSC">{acc.ifscCode}</td>
                                    <td data-label="Account Number">
                                        {acc.accountNumber}
                                    </td>
                                    <td data-label="Action">
                                        <button
                                            onClick={() =>
                                                handleDelete(acc._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            <div>
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <span>Page {page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={accounts.length < limit}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
