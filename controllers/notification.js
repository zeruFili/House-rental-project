const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
  try {
    const { user, request, house, description } = req.body;

    // Create a new notification
    const notification = new Notification({
      user,
      request,
      house,
      description,
    });

    // Save the notification
    await notification.save();

    res.json({ message: "Notification created successfully", notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find notifications based on the user ID
    const notifications = await Notification.find({ user: userId });

    res.json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createNotification, getNotificationsByUserId };
