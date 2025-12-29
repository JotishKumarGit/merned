import React, { useEffect, useState } from "react";
import { useCartStore } from "../../stores/cartStore";
import LoadingPage from "../../components/ui/LoaderPage";
import api from "../../api/apiClient";

export default function CartPage() {
  const {items,totalPrice,fetchCart,updateQuantity,removeFromCart,clearCart,loading,error,} = useCartStore();

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleCheckout = async () => {
    if (!items || items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    const orderItems = items.map((item) => ({
      product: item.product._id,
      qty: item.quantity,
    }));

    try {
      setCheckoutLoading(true);

      // 1️⃣ Create Order
      const orderRes = await api.post("/orders", { orderItems });
      const orderId = orderRes.data.order._id;

      // 2️⃣ Create Razorpay order
      const { data } = await api.post("/payment/razorpay/create-order", { orderId });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Apna Store",
        description: "Order Payment",
        order_id: data.razorpayOrderId,

        handler: async (response) => {
          try {
            // 3️⃣ Verify payment
            await api.post("/payment/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            // 4️⃣ Clear frontend cart
            clearCart();
            alert("✅ Payment successful & order placed");
          } catch (err) {
            console.error("Payment verify error:", err);
            alert("Payment verification failed");
          }
        },

        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold">🛒 My Shopping Cart</h2>

      {items.length === 0 ? (
        <div className="text-center mt-4">Your cart is empty</div>
      ) : (
        <>
          <div className="table-responsive shadow-sm rounded">
            <table className="table align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product._id}>
                    <td>
                      <img
                        src={item.product.image || "/placeholder.png"}
                        alt={item.product.name}
                        width="70"
                        className="rounded"
                      />
                    </td>
                    <td>{item.product.name}</td>
                    <td>₹{item.product.price}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2 fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>₹{item.product.price * item.quantity}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4 className="fw-bold">Total: ₹{totalPrice}</h4>
            <div>
              <button className="btn btn-outline-warning me-2" onClick={clearCart}>
                Clear Cart
              </button>
              <button
                className="btn btn-success"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Processing..." : "Checkout →"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
