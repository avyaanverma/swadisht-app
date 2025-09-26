const foodPartnerModel = require("../models/foodpartner.model")
const foodModel = require("../models/food.model")

async function getFoodPartnerById(req,res){
    // return res.json({
    //     message: "Hello world",
    //     id: req.params.id
    // })
    try{

        const id = req.params.id;
        const foodPartner = await foodPartnerModel.findById(id)
        if(!foodPartner){
            return res.status(404).json({
                message: "Food Partner not found."
            })
        }
    
        const food = await foodModel.find({
            foodPartner: id
        }) 
    
        res.status(200).json({
            message: "Food Partner found.",
            foodPartner,
            food
        })
    }
    catch(err){
        console.log(err)
        return res.json({
            message: "There is some problem."
        })
    }

}

module.exports = {
    getFoodPartnerById
}