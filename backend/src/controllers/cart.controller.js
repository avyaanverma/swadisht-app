const mongoose = require("mongoose");
const cartModel = require("../models/cart.model");
const foodItemModel = require("../models/foodItem.model");

async function getCart(req, res) {
  const cart = await cartModel
    .findOne({ user: req.user._id })
    .populate("items.foodItem", "name description price imageUrl foodPartner");

  return res.status(200).json({
    message: "Cart fetched successfully.",
    cart: cart || { user: req.user._id, items: [] },
  });
}

async function addToCart(req, res) {
  const { foodItemId, quantity } = req.body || {};

  if (!mongoose.isValidObjectId(foodItemId)) {
    return res.status(400).json({ message: "Invalid foodItemId." });
  }

  const qty = Number(quantity || 1);
  if (!Number.isFinite(qty) || qty < 1) {
    return res.status(400).json({ message: "Invalid quantity." });
  }

  const foodItem = await foodItemModel.findById(foodItemId).select("_id");
  if (!foodItem) return res.status(404).json({ message: "Food item not found." });

  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id, items: [] } },
    { new: true, upsert: true }
  );

  const existingIndex = cart.items.findIndex((i) => i.foodItem.toString() === foodItemId);
  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += qty;
  } else {
    cart.items.push({ foodItem: foodItemId, quantity: qty });
  }

  await cart.save();

  const populated = await cartModel
    .findById(cart._id)
    .populate("items.foodItem", "name description price imageUrl foodPartner");

  return res.status(200).json({
    message: "Added to cart.",
    cart: populated,
  });
}

async function updateCartItem(req, res) {
  const { foodItemId, quantity } = req.body || {};

  if (!mongoose.isValidObjectId(foodItemId)) {
    return res.status(400).json({ message: "Invalid foodItemId." });
  }

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 0) {
    return res.status(400).json({ message: "Invalid quantity." });
  }

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return res.status(200).json({ message: "Cart updated.", cart: { user: req.user._id, items: [] } });

  cart.items = cart.items
    .map((i) => (i.foodItem.toString() === foodItemId ? { ...i.toObject(), quantity: qty } : i))
    .filter((i) => i.quantity > 0);

  await cart.save();

  const populated = await cartModel
    .findById(cart._id)
    .populate("items.foodItem", "name description price imageUrl foodPartner");

  return res.status(200).json({ message: "Cart updated.", cart: populated });
}

async function clearCart(req, res) {
  await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [] } },
    { new: true, upsert: true }
  );
  return res.status(200).json({ message: "Cart cleared." });
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
};

