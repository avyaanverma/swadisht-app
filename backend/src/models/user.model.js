const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String
    }
},
    {
        timestamps: true // our database maintains timestamps of when the user was created or updated
    }

)


const userModel = mongoose.model("user", userSchema);
module.exports = userModel;