// src/pages/admin/Orders.jsx

import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import api from "../../api/apiClient";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");

  // Fetch all orders (admin)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders"); // your backend GET /orders route
      setOrders(data); // your backend sends array directly, as per your code
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch orders");
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open modal & set order
  const handleShow = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  // Update order status
  const handleStatusUpdate = async () => {
    try {
      await api.put(`/orders/${selectedOrder._id}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
      handleClose();
    } catch (error) {
      toast.error("Failed to update order status");
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Order Management</h3>

      {loading ? (
        <div className="text-center p-3"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>User</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length ? (
              orders.map((order, idx) => (
                <tr key={order._id}>
                  <td>{idx + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.user?.name || order.user?.email}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <Button variant="dark" size="sm" onClick={() => handleShow(order)}>
                      <FaRegEdit size={20} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal for Order Details and Status Update */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <h5>Order ID: {selectedOrder._id}</h5>
              <p>
                <strong>User:</strong> {selectedOrder.user?.name || selectedOrder.user?.email}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>

              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.product?.name || item.product}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.product?.price || item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Form.Group>
                <Form.Label>Update Status</Form.Label>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;
