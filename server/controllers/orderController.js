
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// placed order 
export const placeOrder = async (req, res) => {
  try {
    const { orderItems, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    } 

    // Check and update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      product.stock -= item.qty;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalAmount,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// cancle Order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    // Restore stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock += item.qty;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled and stock restored', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simulate Payment (Mark Order as Paid)
export const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'paid';
    await order.save();

    res.status(200).json({ message: 'Order marked as paid', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Orders for Logged-In User
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — Update Order Status (Shipped/Delivered)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  get my total orders count 
export const getMyOrdersCount = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ user: req.user._id });

    res.status(200).json({
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
