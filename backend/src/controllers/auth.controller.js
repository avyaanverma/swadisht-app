const userModel = require("../models/user.model")
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// User controllers
async function registerUser(req, res) {
    // yeh ek aisa route hain jaha prr humne fullName, email, and password liya hain 
    // yeh register wala api route for authentication 
    // toh iss waleh route meh request is jo user se hamare paas aa raha hain
    // aur res is jo hum user ko bhej raheh hain

    const { fullName, email, password } = req.body;
    
    // abhumne yaha check kara ki email exists karta h ki nahi
    // uske liye humne jo model banaya thah uska ek function use kiya findOne({})
    // jo ki ek object leta hain aur phir database meh check karta hain ki exists karta ki nahi
    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if(isUserAlreadyExists) {
        return res.status(400).json({
            message: "Email already taken."
        })
    }

    // bcrypt library keh help seh humne yaha parr password ko hash kiyah
    const hashedPassword = await bcrypt.hash(password, 10)

    // userModel.create({}) iss function seh humne database meh apna user wali entry jo thi woh kardi hain
    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    })

    // ab is point prr hamara user bann chukka hain toh hum token bana raheh hain taaki hum yeh bata paaye ki jo requests aari hain woh authenticated h ki nahi
    const token = jwt.sign({
        // yaha prr humne _id isliye liya h coz database _id khudse add krta h 
        id: user._id,
    }, process.env.JWT_SECRET)
    
    res.cookie("token", token)
    
    return res.status(201).json({
        message: "User registered successfully",
        user : {
            id : user._id,
            email: user.email,
            fullName: user.fullName
        }
    })
    
}

async function loginUser(req,res){
    const {email, password} = req.body;
    console.log(req.body);
    
    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            // yaha prr humlog invalid email or password karte hain kyuki iss sameh prr hum dictionary attack or brute force attack koh avoid karne ke liyeh yeh karr rahe hote hain
            message: "Invalid email or Password."
        })
    }

    const checkPassword = bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(400).json({
            message: "Invalid email or Password."
        })
    }

    const token = jwt.sign({
        id : user._id
    },  process.env.JWT_SECRET)

    res.cookie("token", token)

    return res.status(200).json({
        message: "User successfully logged in",
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email
        }
    })


}

function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully."
    })
}


// Food Partner controllers
async function registerFoodPartner(req, res) {
    const {fullName, businessName, contactNumber, address, email, password} = req.body;
    
    const isFoodPartnerAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if(isFoodPartnerAlreadyExists) {
        return res.status(400).json({
            message: "Email already taken."
        })
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const foodPartner = await foodPartnerModel.create({
        fullName,
        email,
        address,
        businessName,
        contactNumber,
        password:hashedPassword
    })

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    return res.status(201).json({
        message: "Food Partner registered successfully",
        user:{
            id: foodPartner._id,
            fullName: foodPartner.fullName,
            email: foodPartner.email,
            businessName: foodPartner.businessName,
            contactNumber: foodPartner.contactNumber,
            address: foodPartner.address
        }
    })
}

async function loginFoodPartner(req,res){
    const {email, password} = req.body

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if(!foodPartner){
        return res.status(400).json({
            message: "Invalid email or Password."
        })
    }

    const checkPassword = bcrypt.compare(password, foodPartner.password)

    if(!checkPassword){
        return res.status(400).json({
            message: "Invalid email or Password."
        })
    }

    const token = jwt.sign({
        id: foodPartner._id
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    return res.status(200).json({
        message: "Food Partner successfully logged in",
        user:{
            id: foodPartner._id,
            email: foodPartner.email,
            fullName: foodPartner.fullName,
        }
    })
}

function logoutFoodPartner(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message: "Food Partner logged out successfully."
    })
}

module.exports = {
    registerUser, 
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}