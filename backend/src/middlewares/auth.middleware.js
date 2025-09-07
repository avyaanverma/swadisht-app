const foodPartnerModel = require("../models/foodpartner.model")
const jwt  = require("jsonwebtoken")

async function authFoodPartnerMiddleware(req, res, next){
    // sabse pehleh hum token check karenge h ki nahi jo ki req ki cookies.token meh hoga
    const token = req.cookies.token

    if(!token){
        return res.status(400).json({
            message: "Unauthorized access."
        })
    }

    try{
        // decode karne ke liye hum verifiy functon lenge jo token aur secret key usko decode krdega
        // yaha se ek object return hoga
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const foodPartner = await foodPartnerModel.findById(decoded.id)

        // hum yeh likha karr ek naya attribute bana rhe hain request body mein
        req.foodPartner = foodPartner
        
        next()

    } catch(err){
        return res.status(401).json({
            message: "Invalid Token."
        })
    }
}

module.exports = {authFoodPartnerMiddleware}