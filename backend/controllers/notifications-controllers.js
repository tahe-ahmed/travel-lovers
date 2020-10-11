// const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Notifications = require("../models/notifications");
const mongoose = require("mongoose");

////////// set the notifications to the DB /////
const setNotifications = async (req, res, next) => {
  const { receiver, sender, comment, placeId, read,follow } = req.body;
  let receiversId;
  if (receiver !== undefined) {
    receiversId = receiver.map((Areceiver) => Areceiver._id);
  }

  const notification = new Notifications({
    receiver: receiversId,
    sender,
    place: placeId,
    read,
    comment,
    follow
  });

  try {
    await notification.save((err, notifi) => {
      if (err) return res.json({ success: false, err });

      Notifications.find({ _id: notifi._id })
        .lean()
        .populate("receiver", "name image")
        .exec((err, result) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json({ message: "notification saved", result });
        });
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not save notification.",
      500
    );
    return next(error);
  }
};

////////////// get all the notification related to a given receiver /////
const getNotificationByReceiverId = async (req, res, next) => {
  const receiverId = req.params.rid;
  try {
    await Notifications.find({
      receiver: mongoose.Types.ObjectId(receiverId),
    })
      .populate("sender", "name image")
      .exec((err, notifications) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ notifications });
      });
  } catch {
    const error = new HttpError(
      "Something went wrong, could not find notifications.",
      500
    );
    return next(error);
  }
};

const updateNotifiReceiverIds = async (req, res, next) => {
  const { notifiID, receiverID } = req.body;
  //// find the notifi document
  let notifi;
  try {
    notifi = await Notifications.findById(notifiID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }
  const receiverNumber = notifi.receiver.length;
  if (receiverNumber === 1) {
    try {
      await notifi.remove();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not delete comment.",
        500
      );
      return next(error);
    }
  }

  const filteredNotifi = notifi.receiver.filter(
    (rece) => rece.toString() !== receiverID.toString()
  );

  notifi.receiver = [filteredNotifi];

  try {
    await notifi.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }
  res.status(200).json({ notifi });
};
////////// delete notifications from backend by comment Id
const deleteNotificationByCommentId = async (req, res, next) => {
  const commentId = req.params.cid;

  let notifi;
  try {
    notifi = await Notifications.findOne({ comment: commentId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete notification in comment, maybe comment not exist.",
      500
    );
    return next(error);
  }
  if (!notifi) {
    const error = new HttpError(
      "Could not find notification with this comment id.",
      404
    );
    return next(error);
  }
  // delete from database
  try {
    await notifi.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete comment.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place.", notifi: notifi });
};

exports.setNotifications = setNotifications;
exports.getNotificationByReceiverId = getNotificationByReceiverId;
exports.deleteNotificationByCommentId = deleteNotificationByCommentId;
exports.updateNotifiReceiverIds = updateNotifiReceiverIds;
