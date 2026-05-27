const mongoose = require("mongoose");
const foodPartnerModel = require("../models/foodpartner.model");
const foodReelModel = require("../models/foodReel.model");
const foodItemModel = require("../models/foodItem.model");
const foodModel = require("../models/food.model");

async function getFoodPartnerById(req,res){
    try{
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid id." });
        }

        // Primary: treat :id as foodPartner id
        let foodPartner = await foodPartnerModel.findById(id);
        let resolvedFoodPartnerId = id;

        // Fallbacks: client might accidentally send reel/food id instead of foodPartner id
        if (!foodPartner) {
            const reel = await foodReelModel.findById(id).select("foodPartner");
            if (reel?.foodPartner) {
                resolvedFoodPartnerId = reel.foodPartner.toString();
                foodPartner = await foodPartnerModel.findById(resolvedFoodPartnerId);
            }
        }

        // Backward-compat: old reels lived in "food" collection (/api/food)
        if (!foodPartner) {
            const oldFood = await foodModel.findById(id).select("foodPartner");
            if (oldFood?.foodPartner) {
                resolvedFoodPartnerId = oldFood.foodPartner.toString();
                foodPartner = await foodPartnerModel.findById(resolvedFoodPartnerId);
            }
        }

        if(!foodPartner){
            return res.status(404).json({ message: "Food Partner not found." })
        }
    
        const reels = await foodReelModel
            .find({ foodPartner: resolvedFoodPartnerId })
            .sort({ createdAt: -1 });

        const foodItems = await foodItemModel
            .find({ foodPartner: resolvedFoodPartnerId })
            .sort({ createdAt: -1 });
    
        res.status(200).json({
            message: "Food Partner found.",
            foodPartner,
            reels,
            foodItems
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ message: "There is some problem." })
    }

}

module.exports = {
    getFoodPartnerById,
    async listFoodPartners(req, res) {
        try {
            const { q, tags } = req.query || {};

            const query = {};

            if (q) {
                const regex = new RegExp(String(q).trim(), "i");
                query.$or = [
                    { businessName: regex },
                    { fullName: regex },
                    { address: regex },
                ];
            }

            const parsedTags = String(tags || "")
                .split(",")
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean);

            if (parsedTags.length > 0) {
                query.tags = { $all: parsedTags };
            }

            const partners = await foodPartnerModel
                .find(query)
                .select("businessName fullName address tags")
                .sort({ businessName: 1 });

            return res.status(200).json({
                message: "Food partners fetched successfully.",
                partners,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "There is some problem." });
        }
    }
}
