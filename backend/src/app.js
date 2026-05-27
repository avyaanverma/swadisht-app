// create server
require('dotenv').config()
const express = require("express");
const cookieParser = require('cookie-parser')
const morgan = require("morgan");
const cors = require("cors")
const authRoutes = require('./routes/auth.routes')
const foodRoutes = require('./routes/food.routes')
const reelsRoutes = require("./routes/reels.routes")
const foodsRoutes = require("./routes/foods.routes")
const foodPartnerRoutes = require("./routes/foodPartner.routes")


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(morgan("tiny"));


app.get('/' ,(req,res)=>{
    res.send("Hello World")
})

app.use('/api/auth' , authRoutes)
// Backward-compat: old /api/food was used for reels earlier
app.use("/api/food", foodRoutes)
app.use("/api/reels", reelsRoutes)
app.use("/api/foods", foodsRoutes)
app.use('/api/food-partner', foodPartnerRoutes)

module.exports = app
