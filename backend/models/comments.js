const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    writerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    placeId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment };
