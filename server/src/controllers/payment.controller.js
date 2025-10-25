import Razorpay from "razorpay";
import Payment from "../models/Payment.model.js";
import Product from "../models/Product.model.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const options = {
      amount: Math.round(product.price.amount),
      currency: product.price.currency,
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      status: "pending",
    });

    await payment.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const payment = await Payment.findOne({ orderId: orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    payment.paymentId = paymentId;
    payment.signature = signature;
    payment.status = "completed";
    await payment.save();

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
}