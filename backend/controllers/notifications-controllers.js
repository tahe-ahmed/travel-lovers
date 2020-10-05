// const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Notifications = require("../models/notifications");

////////// set the notifications to the DB /////
const setNotifications = async (req, res, next) => {
  const { receiver, sender, placeId, read } = req.body;

  const receiversId = receiver.map((Areceiver) => Areceiver._id);
  //   console.log(receiversId);
  const notifiArray = receiversId.map((_receiver) => ({
    receiver: _receiver,
    sender,
    place: placeId,
    read,
  }));

  let doc;
  try {
    doc = await Notifications.create(notifiArray);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not save notification.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "notification saved", doc });
};

////////////// get all the notification related to a given receiver /////
const getNotificationByReceiverId = async (req, res, next) => {
  const receiverId = req.params.rid;
  try {
    await Notifications.find({
      receiver: receiverId,
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

////////// delete notifications from backend byId
const deleteNotificationById = async (req, res, next) => {
  const receiverId = req.body.rid;
  // try {
  //   await Notifications.deleteMany({}, (err, result) => {
  //     if (err) return res.status(400).send(err);
  //     res.status(200).json({ message: "deleted successfully", result });
  //   });
  // } catch {
  //   const error = new HttpError(
  //     "Something went wrong, could not find notifications.",
  //     500
  //   );
  //   return next(error);
  // }
  // res.status(200).json({message: "deleted successfully"})
};

exports.setNotifications = setNotifications;
exports.getNotificationByReceiverId = getNotificationByReceiverId;
exports.deleteNotificationById = deleteNotificationById;
