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

// GET /api/reels/me [protected] - Food partner's reels
router.get("/me", authMiddleware.authFoodPartnerMiddleware, foodReelController.getMyReels);

// DELETE /api/reels/:id [protected] - Delete own reel
router.delete("/:id", authMiddleware.authFoodPartnerMiddleware, foodReelController.deleteReel);

module.exports = router;
