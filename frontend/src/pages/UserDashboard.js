import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import Header from "../components/Header";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import AccountCard from "../components/AccountCard";
import BankFormModal from "../components/BankFormModal";

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem("token");
    const [selectedMethod, setSelectedMethod] = useState("");
    const [showBankForm, setShowBankForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        if (method === "Bank") {
            setShowBankForm(true);
        }
    };

    const submitBankDetails = async (data, accountId = null) => {
        try {
            if (accountId) {
                // Edit flow
                await axios.put(
                    `/bank/${accountId}`,
                    {
                        bankName: data.bankName,
                        accountHolderName: data.holderName,
                        accountNumber: data.accountNumber,
                        branchName: data.branchName,
                        ifscCode: data.ifscCode,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                // Add flow
                await axios.post(
                    "/bank/add",
                    {
                        bankName: data.bankName,
                        accountHolderName: data.holderName,
                        accountNumber: data.accountNumber,
                        branchName: data.branchName,
                        ifscCode: data.ifscCode,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }

            await fetchUserData();
        } catch (err) {
            console.error("Submit error:", err);
            alert("Failed to submit bank details");
        } finally {
            setShowBankForm(false);
            setEditingAccount(null);
        }
    };

    const handleEdit = (account) => {
        setEditingAccount(account);
    };

    const handleDelete = async (accountId) => {
        try {
            await axios.delete(`/bank/${accountId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchUserData();
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete account");
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get("/user/account", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
            console.log(response.data);
        } catch (err) {
            console.error("Failed to fetch user data", err);
            setUserData(null);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchUserData();
    }, []);

    return (
        <div>
            <Header
                user={userData ? userData.user : null}
                onLogout={handleLogout}
            />
            <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onSelect={handleMethodSelect}
            />
            {(showBankForm || editingAccount) && (
                <BankFormModal
                    onClose={() => {
                        setShowBankForm(false);
                        setEditingAccount(null);
                    }}
                    onSubmit={submitBankDetails}
                    initialData={editingAccount}
                />
            )}

            {userData &&
                userData.accounts?.map((account) => (
                    <AccountCard
                        key={account._id}
                        account={account}
                        user={userData.user}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
        </div>
    );
};

export default UserDashboard;
