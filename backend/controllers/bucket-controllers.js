const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/user');


const getUserBucketList = async (req, res, next) => {
  const bucketerId = req.params.uid;

  let userBuckets;         // check bucket place adder user in db
  try {
    userBuckets = await User.findById(bucketerId).populate("buckets");;
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a user for the provided id.', 500));
  }

  if (!userBuckets) {
    return next(new HttpError("Could not find user for provided id.", 404));
  }

  // response frontend
  res.status(201).json({ userBucketList: userBuckets.buckets.toObject({ getters: true }) });
};


const addPlaceToUserBucketList = async (req, res, next) => {
  const placeId = req.params.pid;
  const { bucketerId } = req.body;

  let bucketPlace;        // check users added bucket place in db
  try {
    bucketPlace = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a place for the provided id.', 500));
  }
  if (!bucketPlace) {
    return next(new HttpError(`Could not find a place for the provided place id.`, 404));
  }


  let bucketerUser;         // check bucket place adder user in db
  try {
    bucketerUser = await User.findById(bucketerId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a user for the provided id.', 500));
  }

  if (!bucketerUser) {
    return next(new HttpError("Could not find user for provided id.", 404));
  }

  try {                   // save bucket place to users document and add user to place document
    const sess = await mongoose.startSession();
    sess.startTransaction();
    bucketerUser.buckets.push(bucketPlace);
    await bucketerUser.save({ session: sess });
    bucketPlace.bucketListAdderId.push(bucketerUser);
    await bucketPlace.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Adding place failed, place try again.', 500));
  }
  // response frontend
  res.status(201).json({ bucketPlace: bucketPlace, bucketerUser: bucketerUser });
};

const deletePlaceFromBucketList = async (req, res, next) => {
  const placeId = req.params.pid;
  const userId = req.params.uid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  let bucketerUser;         // check bucket place adder user in db
  try {
    bucketerUser = await User.findById(userId);
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find a user for the provided id.', 500));
  }

  if (!bucketerUser) {
    return next(new HttpError("Could not find user for provided id.", 404));
  }

  try {
    await bucketerUser.buckets.pull(place);
    await bucketerUser.save();
  } catch (error) {
    return next(new HttpError("Something went wrong, could not delete place.", 500));
  }

  try {
    await place.bucketListAdderId.pull(bucketerUser);
    await place.save();
  } catch (error) {
    return next(new HttpError("Something went wrong, could not delete user.", 500));
  }
  res.status(200).json({ message: "Place removed from bucket list place.And The user removed from bucketer list" });
};

exports.addPlaceToUserBucketList = addPlaceToUserBucketList;
exports.getUserBucketList = getUserBucketList;
exports.deletePlaceFromBucketList = deletePlaceFromBucketList;