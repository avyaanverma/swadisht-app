const mongoose = require("mongoose");

const foodReelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodpartner",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const foodReelModel = mongoose.model("foodreel", foodReelSchema);
module.exports = foodReelModel;

