const foodReelModel = require("../models/foodReel.model");
const storageService = require("../services/storage.services");
const { v4: uuid } = require("uuid");

async function createReel(req, res) {
  if (!req.file?.buffer) {
    return res.status(400).json({ message: "Video file is required." });
  }

  if (!req.body?.title || !req.body?.description) {
    return res.status(400).json({ message: "title and description are required." });
  }

  const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

  const reel = await foodReelModel.create({
    title: req.body.title,
    description: req.body.description,
    videoUrl: fileUploadResult.url,
    foodPartner: req.foodPartner._id,
  });

  return res.status(201).json({
    message: "Reel created successfully.",
    reel,
  });
}

async function getReels(req, res) {
  const { foodPartner } = req.query || {};
  const query = {};
  if (foodPartner) query.foodPartner = foodPartner;

  const reels = await foodReelModel
    .find(query)
    .populate("foodPartner", "businessName fullName address")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Reels fetched successfully.",
    reels,
  });
}

module.exports = {
  createReel,
  getReels,
  async getMyReels(req, res) {
    const reels = await foodReelModel
      .find({ foodPartner: req.foodPartner._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Your reels fetched successfully.",
      reels,
    });
  },
  async deleteReel(req, res) {
    const { id } = req.params;
    const reel = await foodReelModel.findOneAndDelete({
      _id: id,
      foodPartner: req.foodPartner._id,
    });

    if (!reel) {
      return res.status(404).json({ message: "Reel not found." });
    }

    return res.status(200).json({ message: "Reel deleted.", reel });
  },
};
