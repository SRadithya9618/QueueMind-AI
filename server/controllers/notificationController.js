const Notification = require("../models/Notification");

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort("-createdAt")
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/read/:id
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to create notification (for internal use)
const createNotification = async (io, userId, title, message, type = "info") => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
    });

    // Emit to specific user if online
    io.to(userId.toString()).emit("newNotification", notification);
    
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

module.exports = { getNotifications, markAsRead, createNotification };
