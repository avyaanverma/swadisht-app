const express = require("express")
const { getFoodPartnerById, listFoodPartners } = require("../controllers/foodPartner.controller");

const router = express.Router();


// /api/food-partner?q=&tags=indian,vegan
router.get("/", listFoodPartners)

// /api/food-partner/:id
router.get("/:id", getFoodPartnerById)

module.exports = router
