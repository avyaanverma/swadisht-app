const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const foodReelController = require("../controllers/foodReel.controller");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();



// POST /api/reels [protected] - Food partners upload reels
router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodReelController.createReel
);

// GET /api/reels [public] - Customers/public can watch reels
router.get("/", foodReelController.getReels);

module.exports = router;

