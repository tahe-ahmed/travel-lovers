const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const { Comment } = require("../models/comments");
const Notifications = require("../models/notifications");

////////// find the comments for specific place id ////////
const getCommentsByPlaceId = async (req, res, next) => {
  const placeId = req.params.pid;
  let comments;
  try {
    comments = await Comment.find({ placeId: placeId })
      .populate("writerId", "name image")
      .exec((err, comment) => {
        if (err) return res.status(400).send(err);
        console.log('comments',comment);
        res.status(200).json({ comment });
      });
   
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find comments.",
      500
    );
    return next(error);
  }
};

/////////////// create a new comment and save to DB ///////
const createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid comments inputs passed, please check you input.",
        422
      )
    );
  }

  //   const writer = req.userData.userId;
  const { writerId, placeId, content } = req.body;

  const createdComment = new Comment({
    writerId,
    placeId,
    content,
  });

  try {
    await createdComment.save((err, comment) => {
      if (err) return res.json({ success: false, err });

      Comment.find({ _id: comment._id })
        .lean()
        .populate("writerId.name")
        .exec((err, result) => {
          if (err) return res.json({ success: false, err });
        });
    });
  } catch (err) {
    const error = new HttpError(
      "Creating comment failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ comment: createdComment });
};

////////// delete the comment from DB and return the deleted comment ///////
const deleteComment = async (req, res, next) => {
  // get the id from req
  const commentId = req.params.cid;

  // make sure comment exsit
  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete comment, maybe comment not exist.",
      500
    );
    return next(error);
  }
  if (!comment) {
    const error = new HttpError("Could not find comment with this id.", 404);
    return next(error);
  }

  //   if (comment.writerId._id !== req.userData.userId) {
  //     const error = new HttpError(
  //       "You are not allowed to delete this comment.",
  //       401
  //     );
  //     return next(error);
  //   }

  //delete from database
  try {
    await comment.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete comment.",
      500
    );
    return next(error);
  }

  ///////////// delete any notifications mentions related to the comment
  let notifi;
  try {
    notifi = await Notifications.findOne({comment:commentId});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete notification in comment, maybe comment not exist.",
      500
    );
    return next(error);
  }
  if (!notifi) {
    const error = new HttpError("Could not find notification with this comment id.", 404);
    return next(error);
  }
  // delete from database
  try {
    await notifi.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete notification.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place.", comment: comment , notifi});
};

exports.createComment = createComment;
exports.getCommentsByPlaceId = getCommentsByPlaceId;
exports.deleteComment = deleteComment;
