const express = require("express")
const router = express.Router()
const foodReelController = require("../controllers/foodReel.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
})

// POST /api/food [protected]- Backward-compat: upload reel
router.post(
    '/', 
    authMiddleware.authFoodPartnerMiddleware , 
    upload.single("video"),
    foodReelController.createReel
)

// GET /api/food [public]- Backward-compat: list reels
router.get(
    '/', 
    foodReelController.getReels
)


module.exports = router
