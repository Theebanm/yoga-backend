const express = require("express");
const paymentController = require("../controller/paymentController");
const verifyToken = require("../utils/verifyToken");

const paymentRoute = express.Router();

paymentRoute.post(
  "/create-payment-intent",
  verifyToken,
  paymentController.createPaymentIntent
);

paymentRoute.post("/payment-info", verifyToken, paymentController.paymentInfo);
paymentRoute.get("/payment-history/:id", paymentController.paymentHistory);

module.exports = paymentRoute;
