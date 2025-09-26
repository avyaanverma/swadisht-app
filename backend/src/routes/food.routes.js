const express = require("express")
const router = express.Router()
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const multer = require("multer")

const upload = multer({
    storage: multer.memoryStorage(),
})

// POST /api/food [protected]- Create a new food item
router.post(
    '/', 
    authMiddleware.authFoodPartnerMiddleware , 
    upload.single("video"),foodController.createFood
)

// GET /api/food [protected]- Get all food items
router.get(
    '/', 
    authMiddleware.authUserMiddleware, 
    foodController.getFoodItems
)


module.exports = router