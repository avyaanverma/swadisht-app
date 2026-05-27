const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const cartController = require("../controllers/cart.controller");

const router = express.Router();

// /api/cart (user only)
router.get("/", authMiddleware.authUserMiddleware, cartController.getCart);
router.post("/add", authMiddleware.authUserMiddleware, cartController.addToCart);
router.patch("/item", authMiddleware.authUserMiddleware, cartController.updateCartItem);
router.post("/clear", authMiddleware.authUserMiddleware, cartController.clearCart);

module.exports = router;

