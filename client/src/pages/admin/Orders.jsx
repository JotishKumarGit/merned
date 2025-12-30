import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Spinner, Badge } from "react-bootstrap";
import api from "../../api/apiClient";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");

  /* ================= FETCH ALL ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= MODAL HANDLERS ================= */
  const handleShow = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  /* ================= UPDATE STATUS ================= */
  const handleStatusUpdate = async () => {
    try {
      await api.put(`/orders/${selectedOrder._id}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
      handleClose();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  /* ================= STATUS BADGE ================= */
  const statusBadge = (status) => {
    const map = {
      pending: "warning",
      paid: "primary",
      shipped: "info",
      delivered: "success",
      cancelled: "danger",
    };
    return <Badge bg={map[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📦 Order Management</h3>
        <Button variant="dark">Total Orders: {orders.length}</Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length ? (
              orders.map((order, i) => (
                <tr key={order._id}>
                  <td>{i + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.user?.name || order.user?.email}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{statusBadge(order.status)}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <Button size="sm" onClick={() => handleShow(order)}>
                      <FaRegEdit />
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

      {/* ================= ORDER DETAILS MODAL ================= */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>🧾 Order Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedOrder && (
            <>
              <h6>Order ID: {selectedOrder._id}</h6>
              <p><b>User:</b> {selectedOrder.user?.name} ({selectedOrder.user?.email})</p>
              <p><b>Status:</b> {statusBadge(selectedOrder.status)}</p>

              {/* SHIPPING ADDRESS */}
              <div className="border rounded p-3 mb-3">
                <h6>📍 Shipping Address</h6>
                <p className="mb-1">{selectedOrder.shippingAddress.fullName}</p>
                <p className="mb-1">{selectedOrder.shippingAddress.phone}</p>
                <p className="mb-1">
                  {selectedOrder.shippingAddress.addressLine},{" "}
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state} -{" "}
                  {selectedOrder.shippingAddress.pincode}
                </p>
              </div>

              {/* PRODUCTS */}
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.product?.name}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.product?.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* PAYMENT INFO */}
              <div className="border rounded p-3 mb-3">
                <h6>💳 Payment Info</h6>
                {selectedOrder.paymentInfo?.razorpay_payment_id ? (
                  <>
                    <p className="mb-1">Payment ID: {selectedOrder.paymentInfo.razorpay_payment_id}</p>
                    <p className="mb-1">Paid At: {new Date(selectedOrder.paymentInfo.paidAt).toLocaleString()}</p>
                  </>
                ) : (
                  <p className="text-danger">Payment Pending</p>
                )}
              </div>

              {/* UPDATE STATUS */}
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
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="success" onClick={handleStatusUpdate}>Update Status</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;
