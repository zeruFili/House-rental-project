const mongoose = require("mongoose");
const Joi = require("joi");

const rentalRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "House",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "rented", "rejected"],
    default: "pending",
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  alternativeDates: {
    type: [Date],
  },
});

const RentalRequest = mongoose.model("RentalRequest", rentalRequestSchema);

module.exports = RentalRequest;
