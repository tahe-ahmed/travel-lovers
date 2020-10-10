const HttpError = require('../models/http-error');
const { Follow } = require('../models/follow');


/**  We are getting all the users that the relevant user follows and all the users who follow him/her */
const getList = async (req, res, next) => {
  const userId = req.params.uid;

  let followers;
  try {
    followers = await Follow.find({ user: userId })
      .populate({
        path: 'followers following',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .exec((err, follow) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ follow });
      });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find follows.',
      500
    );
    return next(error);
  }
};

 /*  This method works when a follow-up request is sent to a user */
const follow = async (req, res, next) => {
  const user_id = req.params.uid;
  const follow_id = req.body.follow_id;
  const logginUser = req.body.logginUser;

  /*  We add user A to user B’s followers and B to user A’s following */ 

  // Section 1
  let follower;
  try {
    follower = await Follow.findOne({ user: user_id });
  } catch (err) {
    const error = new HttpError(
      'Fetching follow failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!follower) {
    try {
      const createdFollow = new Follow({
        user: user_id,
        following: follow_id,
      });
      follower = await createdFollow.save();
    } catch (err) {
      const errorResult = new HttpError(
        'Create follow failed, please try again later.',
        500
      );
      return next(errorResult);
    }
  }
  if (follower && !follower.following.includes(follow_id)) {
    try {
      follower.following.push(follow_id);
      follower = await follower.save();
    } catch (err) {
      const error = new HttpError(
        'update follow failed, please try again later.',
        500
      );
      return next(error);
    }
  }

  // 2.Section 2

  let following;
  try {
    following = await Follow.findOne({ user: follow_id });
  } catch (err) {
    const error = new HttpError(
      'Fetching follow failed, please try again later.',
      500
    );
    return next(error);
  }
  if (!following) {
    try {
      const createdFollow = new Follow({
        user: follow_id,
        followers: user_id,
      });
      following = await createdFollow.save();
    } catch (err) {
      const error = new HttpError(
        'Create follow failed, please try again later.',
        500
      );
      return next(error);
    }
  }
  if (following && !following.followers.includes(user_id)) {
    try {
      following.followers.push(user_id);
      following = await following.save();
    } catch (err) {
      const error = new HttpError(
        'update follow failed, please try again later.',
        500
      );
      return next(error);
    }
  }

  /** Whose information do you want to send?
  Is it the user you follow or the user who follows you?
  At this point, you decide on it. */
  if (logginUser) {
    res.status(200).json({
      msg: 'Follow is success!',
      followers: follower.followers,
      following: follower.following,
    });
  } else {
    res.status(200).json({
      msg: 'Follow is success!',
      followers: following.followers,
      following: following.following,
    });
  }
};

/** This method works when a unfollow-up request is sent to a user */
const unfollow = async (req, res, next) => {
  const user_id = req.params.uid;
  const follow_id = req.body.follow_id;
  const logginUser = req.body.logginUser;

  /** We add user A to user B’s followers and B to user A’s following*/ 

  // Section 1
  let follower;
  try {
    follower = await Follow.findOne({ user: user_id });
  } catch (err) {
    const error = new HttpError(
      'Fetching follow failed, please try again later.',
      500
    );
    return next(error);
  }

  if (follower && follower.following.includes(follow_id)) {
    try {
      follower.following.remove(follow_id);
      follower = await follower.save();
    } catch (err) {
      const error = new HttpError(
        'update follow failed, please try again later.',
        500
      );
      return next(error);
    }
  }

  // 2. Section 2

  let following;
  try {
    following = await Follow.findOne({ user: follow_id });
  } catch (err) {
    const error = new HttpError(
      'Fetching follow failed, please try again later.',
      500
    );
    return next(error);
  }

  if (following && following.followers.includes(user_id)) {
    try {
      following.followers.remove(user_id);
      following = await following.save();
    } catch (err) {
      const error = new HttpError(
        'update follow failed, please try again later.',
        500
      );
      return next(error);
    }
  }


/* 
  Whose information do you want to send?
  Is it the user you follow or the user who follows you?
  At this point, you decide on it.
*/
  if (logginUser) {
    res.status(200).json({
      msg: 'Follow is success!',
      followers: follower.followers,
      following: follower.following,
    });
  } else {
    res.status(200).json({
      msg: 'Follow is success!',
      followers: following.followers,
      following: following.following,
    });
  }
};

exports.follow = follow;
exports.unfollow = unfollow;
exports.getList = getList;
