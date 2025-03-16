const express = require("express");
const cartController = require("../controller/cartController");
const verifyToken = require("../utils/verifyToken");

const cartRoute = express.Router();

cartRoute.post("/add", verifyToken, cartController.addToCart);
cartRoute.get("/:id", verifyToken, cartController.getCartItem);
cartRoute.get("/", verifyToken, cartController.getCartItems);
cartRoute.delete("/:id", verifyToken, cartController.removeFromCart);

module.exports = cartRoute;
