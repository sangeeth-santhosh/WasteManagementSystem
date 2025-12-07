import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Target user (null if it's a broadcast-style or zone-level notification)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Optional: link to a specific waste report
    wasteReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteReport",
      required: false,
    },

    // Optional: zone targeting (snapshot + id)
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: false,
    },
    zoneNameSnapshot: {
      type: String,
      default: "",
    },

    // Core notification content
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: 450,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: 5000,
    },

    // Classification of notification
    type: {
      type: String,
      enum: ["SYSTEM", "REPORT_STATUS", "REMINDER", "ZONE_ALERT"],
      default: "SYSTEM",
    },

    // Read/unread behaviour
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },

    // For your “admin can send email / notification”
    // This is just for info; actual email sending is handled in controller/service
    deliveryMethod: {
      type: String,
      enum: ["IN_APP", "IN_APP_EMAIL"],
      default: "IN_APP",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Helpful indexes
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ zoneId: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
