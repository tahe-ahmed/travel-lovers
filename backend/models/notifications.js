const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: [{ type: Schema.Types.ObjectId, ref: "User" }], // Ids of the receivers of the notification

    place: {
      type: Schema.Types.ObjectId,
      ref: "Place",
    },
    message: {
      type: String,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    follow:{
      type:Boolean,
    },
    read_by: [
      {
        readerId: { type: Schema.Types.ObjectId, ref: "User" },
        read_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
