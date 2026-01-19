import React, { useState } from "react";
import './User.css';

export default function AddressModal({ show, onClose, onConfirm, loading, }) {

    const [address, setAddress] = useState({ fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "" });

    if (!show) return null;

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const values = Object.values(address);
        if (values.some((v) => v.trim() === "")) {
            alert("Please fill all address fields");
            return;
        }
        onConfirm(address); // parent ko address bhej raha
    };

    return (
        <div className="modal-backdrop show" style={{ backgroundColor: "black", opacity: "inherit" }}>
            <div className="modal d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content p-4">

                        <h5 className="fw-bold mb-3">📦 Shipping Address</h5>

                        <input className="form-control mb-2" name="fullName" placeholder="Full Name" onChange={handleChange} />
                        <input className="form-control mb-2" name="phone" placeholder="Phone Number" onChange={handleChange} />
                        <input className="form-control mb-2" name="addressLine" placeholder="Address" onChange={handleChange} />
                        <input className="form-control mb-2" name="city" placeholder="City" onChange={handleChange} />
                        <input className="form-control mb-2" name="state" placeholder="State" onChange={handleChange} />
                        <input className="form-control mb-3" name="pincode" placeholder="Pincode" onChange={handleChange} />

                        <div className="text-end">
                            <button className="btn btn-secondary me-2" onClick={onClose} disabled={loading} > Cancel </button>
                            <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>Continue to Payment →</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
