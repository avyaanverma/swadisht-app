// create server
require('dotenv').config()
const express = require("express");
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const foodRoutes = require('./routes/food.routes')

const app = express();

// cookie parser ek middle ware hain jo humein cookies read karne meh help karta hain
app.use(cookieParser());
// express.json() ek middleware hain jo humein http bodies padhne meh help karta hain
app.use(express.json());



app.get('/' ,(req,res)=>{
    res.send("Hello World")
})

app.use('/api/auth' , authRoutes)
app.use('/api/food', foodRoutes)

module.exports = app