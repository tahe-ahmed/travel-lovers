const Place = require("./../models/place");
const HttpError = require("./../models/http-error");

const ratePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  const { raterId, raterRating } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);                                      // find the place in db
  } catch (err) {
    return next(new HttpError("Something went wrong, could not find any place.", 500));
  }

  // check if same user rate star update users rating
  if (place.rate.length !== 0 && place.rate.some(iD => iD.raterIds == raterId)) {
    let indexNumber = place.rate.findIndex(key => key.raterIds == raterId);
    place.rate[indexNumber].raterRates = raterRating;
  } else {                                                                        // otherwise push new users rating
    place.rate.push({ raterIds: raterId, raterRates: raterRating });
  }
  // calculate rating average
  const rateAvg = place.rate.map(item => item.raterRates).reduce((prev, next) => prev + next) / place.rate.length;
  place.rateAvg = rateAvg;

  try {
    await place.save();                                                               // save new properties of place
  } catch (err) {
    return next(new HttpError("Something went wrong, could not update place.", 500));
  }

  res.status(200).json({ rateAvg: place.rateAvg, rateLength: place.rate.length });      // response to frontend rate average and length
};

exports.ratePlace = ratePlace;
