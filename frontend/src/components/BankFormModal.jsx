import React, { useState } from "react";
import "../styles/BankFormModal.css";

const BankFormModal = ({ onClose, onSubmit, initialData = null }) => {
    const [form, setForm] = useState({
        bankName: initialData?.bankName || "",
        holderName: initialData?.accountHolderName || "",
        accountNumber: initialData?.accountNumber || "",
        branchName: initialData?.branchName || "",
        ifscCode: initialData?.ifscCode || "",
        confirmAccountNumber: initialData?.accountNumber || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (form.accountNumber !== form.confirmAccountNumber) {
            alert("Account numbers do not match");
            return;
        }

        onSubmit(form, initialData?._id); // Pass ID if editing
    };

    return (
        <div className="bank-modal-overlay">
            <div className="bank-modal-content">
                <h3>{initialData ? "Edit Bank" : "Add Bank"}</h3>

                <input
                    name="bankName"
                    placeholder="Bank Name"
                    value={form.bankName}
                    onChange={handleChange}
                />
                <input
                    name="holderName"
                    placeholder="Holder Name"
                    value={form.holderName}
                    onChange={handleChange}
                />
                <input
                    name="accountNumber"
                    placeholder="Account Number"
                    value={form.accountNumber}
                    onChange={handleChange}
                />
                <input
                    name="branchName"
                    placeholder="Branch"
                    value={form.branchName}
                    onChange={handleChange}
                />
                <input
                    name="ifscCode"
                    placeholder="IFSC Code"
                    value={form.ifscCode}
                    onChange={handleChange}
                />
                <input
                    name="confirmAccountNumber"
                    placeholder="Confirm Account Number"
                    value={form.confirmAccountNumber}
                    onChange={handleChange}
                />

                <div className="bank-modal-buttons">
                    <button onClick={handleSubmit}>
                        {initialData ? "Update Bank" : "Add Bank"}
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default BankFormModal;
