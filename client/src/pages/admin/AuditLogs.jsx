// src/components/admin/AuditLogs.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';


export default function AuditLogs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.get("/api/admin/audit-logs").then(res => {
            setLogs(res.data);
        });
    }, []);

    return (
        <div className="container mt-4">
            <h3>Audit Logs</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Message</th>
                        <th>Admin</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {logs.map(log => (
                        <tr key={log._id}>
                            <td>{log.action}</td>
                            <td>{log.message}</td>
                            <td>{log.adminId?.name || "Unknown"}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))} */}
                    <td>Delete</td>
                    <td>User account deleted</td>
                    <td>Admin User</td>
                    <td>{new Date().toLocaleString()}</td>
                </tbody>
            </table>
        </div>
    );
}
