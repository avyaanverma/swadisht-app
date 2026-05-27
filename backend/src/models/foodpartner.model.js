const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    businessName:{
        type:String,
        required:true,
    },
    contactNumber:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    tags: {
        type: [String],
        default: [],
        index: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
    }
})

const foodPartnerModel = mongoose.model("foodpartner", foodPartnerSchema);
module.exports = foodPartnerModel;
