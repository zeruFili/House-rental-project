const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "RentalRequest",
    default: null,
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "House",
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
