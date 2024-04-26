const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "House",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
