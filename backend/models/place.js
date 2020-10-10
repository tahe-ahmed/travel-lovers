const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  rate: [{                                                                              // for star rating
    raterIds: { type: mongoose.Types.ObjectId, required: false, default: null },
    raterRates: { type: Number, required: false, default: 0 }
  }],
  rateAvg: { type: Number, required: false, default: 0 },                                 // for star rating
  bucketListAdderId: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }], // for checking who added the place to their bucket list
});

module.exports = mongoose.model('Place', placeSchema);
