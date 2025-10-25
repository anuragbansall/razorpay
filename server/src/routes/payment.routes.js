import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/orders/:productId", createPaymentOrder);
paymentRouter.post("/verify", verifyPayment);

export default paymentRouter;
