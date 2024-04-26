const express = require("express");
const {
  createNotification,
  getNotificationsByUserId,
} = require("../controllers/notification");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// POST /notifications
router.post("/", protect, createNotification);
router.get("/:userId", getNotificationsByUserId);

module.exports = router;
