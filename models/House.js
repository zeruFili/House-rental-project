const mongoose = require("mongoose");
const Joi = require("joi");

const houseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    enum: ["available", "unavailable", "rented"],
    default: "available",
  },
  photos: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 3,
  },
});

const House = mongoose.model("House", houseSchema);

module.exports = House;
