const Notification = require("../models/Notification");

// ==========================================
// GET USER NOTIFICATIONS
// ==========================================

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .populate("relatedJob", "company role")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error
    );

    res.status(500).json({
      message: "Unable to fetch notifications",
    });
  }
};


// ==========================================
// GET UNREAD COUNT
// ==========================================

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      count,
    });
  } catch (error) {
    console.error(
      "Unread Count Error:",
      error
    );

    res.status(500).json({
      message: "Unable to fetch unread count",
    });
  }
};


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

const markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark Notification Read Error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to update notification",
    });
  }
};


// ==========================================
// MARK ALL AS READ
// ==========================================

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark All Notifications Read Error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to update notifications",
    });
  }
};


module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};