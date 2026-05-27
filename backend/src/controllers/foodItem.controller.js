const foodItemModel = require("../models/foodItem.model");

async function createFoodItem(req, res) {
  const { name, description, price, imageUrl } = req.body || {};

  if (!name || !description || price === undefined) {
    return res.status(400).json({ message: "name, description and price are required." });
  }

  const foodItem = await foodItemModel.create({
    name,
    description,
    price,
    imageUrl,
    foodPartner: req.foodPartner._id,
  });

  return res.status(201).json({
    message: "Food item created successfully.",
    foodItem,
  });
}

async function getFoodItems(req, res) {
  const { foodPartner } = req.query || {};

  const query = {};
  if (foodPartner) query.foodPartner = foodPartner;

  const foodItems = await foodItemModel
    .find(query)
    .populate("foodPartner", "businessName fullName address")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Food items fetched successfully.",
    foodItems,
  });
}

module.exports = {
  createFoodItem,
  getFoodItems,
  async getMyFoodItems(req, res) {
    const foodItems = await foodItemModel
      .find({ foodPartner: req.foodPartner._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Your food items fetched successfully.",
      foodItems,
    });
  },
  async deleteFoodItem(req, res) {
    const { id } = req.params;
    const foodItem = await foodItemModel.findOneAndDelete({
      _id: id,
      foodPartner: req.foodPartner._id,
    });

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found." });
    }

    return res.status(200).json({ message: "Food item deleted.", foodItem });
  },
};
