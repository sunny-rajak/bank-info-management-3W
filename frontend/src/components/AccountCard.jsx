import React from "react";
import "../styles/AccountCard.css";

const AccountCard = ({ account, onEdit, onDelete }) => {
    const maskAccountNumber = (number) => {
        if (!number || number.length < 6) return number;
        const first2 = number.slice(0, 2);
        const last4 = number.slice(-4);
        const stars = "*".repeat(number.length - 6);
        return `${first2}${stars}${last4}`;
    };

    const maskIFSC = (ifsc) => {
        if (!ifsc || ifsc.length < 6) return ifsc;
        const first2 = ifsc.slice(0, 2);
        const last2 = ifsc.slice(-2);
        const stars = "*".repeat(ifsc.length - 4);
        return `${first2}${stars}${last2}`;
    };

    return (
        <div className="account-card">
            <div className="account-card-header">
                <h3>{account.bankName}</h3>
                <span>Bank</span>
            </div>

            <div className="account-info">
                <p>
                    <strong>A/C No. </strong>{" "}
                    <span>{maskAccountNumber(account.accountNumber)}</span>
                </p>

                <p>
                    <strong>IFSC:</strong>
                    <span> {maskIFSC(account.ifscCode)}</span>
                </p>
            </div>

            <p className="account-holder-name">{account.accountHolderName}</p>

            <div className="account-card-buttons">
                <button onClick={() => onEdit(account)}>Edit</button>
                <button onClick={() => onDelete(account._id)}>Delete</button>
            </div>
        </div>
    );
};

export default AccountCard;
