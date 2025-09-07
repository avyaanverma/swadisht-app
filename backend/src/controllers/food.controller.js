const foodModel = require("../models/food.model")
const storageService = require("../services/storage.services")
const { v4 : uuid } = require("uuid")

async function createFood(req,res){
    
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())
    
    const foodItem = await foodModel.create({
        name: fileUploadResult.name,
        description:req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "Food Created Success.",
        food: foodItem
    })

}

async function getFoodItems(req,res){
    const foodItems = await foodModel.find({})

    return res.status(201).json({
        message: "Food Items Fetched Successfully.",
        foodItems
    })
}

module.exports = {
    createFood,
    getFoodItems
}