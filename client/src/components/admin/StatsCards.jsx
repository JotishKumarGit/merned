import { useEffect, useState } from "react";
import api from "../../api/apiClient";

export default function StatsCards() {
  const [users, setUsers] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchOrdersCount = async () => {
    try {
      const { data } = await api.get("/admin/total-orders");
      setOrdersCount(data.totalOrders);
    } catch (err) {
      console.error("Error fetching total orders:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrdersCount();
  }, []);

  const stats = [
    { title: "Revenue", value: "$45,000", color: "bg-success" },
    { title: "Orders", value: ordersCount, color: "bg-primary" },
    { title: "Users", value: users.length, color: "bg-info" },
  ];

  return (
    <div className="row g-4 mb-4">
      {stats.map((stat) => (
        <div className="col-12 col-md-4" key={stat.title}>
          <div className={`card text-white shadow-sm ${stat.color}`} data-aos="zoom-in">
            <div className="card-body">
              <h5 className="card-title">{stat.title}</h5>
              <p className="card-text fs-4 fw-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
