import React from "react";
import "../styles/PaymentMethodSelector.css";

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
    const methods = ["Bank", "UPI", "GPay", "PhonePe", "Paytm"];

    return (
        <div className="payment-selector">
            <h3>Add Payment Options</h3>
            <div className="payment-buttons">
                {methods.map((method) => (
                    <button key={method} onClick={() => onSelect(method)}>
                        {method}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethodSelector;
