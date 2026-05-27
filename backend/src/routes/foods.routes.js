const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const foodItemController = require("../controllers/foodItem.controller");

const router = express.Router();

// POST /api/foods [protected] - Food partners add menu items
router.post("/", authMiddleware.authFoodPartnerMiddleware, foodItemController.createFoodItem);

// GET /api/foods [public] - Browse menu items (optionally filter by foodPartner)
router.get("/", foodItemController.getFoodItems);

module.exports = router;

