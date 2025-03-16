const asyncHandler = require("express-async-handler");
const Cart = require("../model/Cart");
const cartController = {
  addToCart: asyncHandler(async (req, res) => {
    const { userId, classId, instructorId } = req.body;
    if (!userId || !classId || !instructorId) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const existingItem = await Cart.findOne({ userId, classId });
    if (existingItem) {
      res.status(400);
      throw new Error("Item already exists in cart");
    }
    const cartItem = await Cart.create({
      userId,
      classId,
      instructorId,
    });
    cartItem.save();
    res.status(201).json({
      message: "Item added to cart successfully",
      cartItem,
    });
  }),
  getCartItem: asyncHandler(async (req, res) => {
    const id = req.params.id;
    const cartItem = await Cart.findById(id)
      .populate("classId")
      .populate("instructorId", "-password")
      .populate("userId", "-password");
    if (!cartItem) {
      res.status(404);
      throw new Error("Item not found");
    }
    res.status(200).json(cartItem);
  }),
  getCartItems: asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      res.status(400);
      throw new Error("User id is required");
    }
    const cartItems = await Cart.find({ userId })
      .populate("classId")
      .populate("instructorId", "-password")
      .populate("userId", "-password");
    if (!cartItems) {
      res.status(404);
      throw new Error("No items in cart");
    }

    res.status(200).json(cartItems);
  }),
  removeFromCart: asyncHandler(async (req, res) => {
    const id = req.params.id;
    const cartItem = await Cart.findByIdAndDelete(id);
    if (!cartItem) {
      res.status(404);
      throw new Error("Enter valid id");
    }
    res.status(200).json({ message: "Item removed from cart successfully" });
  }),
};

module.exports = cartController;
