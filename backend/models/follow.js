const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = mongoose.Schema(
  {
    user: {
     type: mongoose.Types.ObjectId, required: true, ref: 'User'
    },
    followers: [
      {
        type: mongoose.Types.ObjectId, required: true, ref: 'User'
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId, required: true, ref: 'User'
      },
    ],
  },
  { toJSON: { virtuals: true } }
);

const Follow = mongoose.model('Follow', followSchema);

module.exports = { Follow };
