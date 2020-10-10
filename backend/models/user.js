const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  gender: { type: String, required: false, default: null }, // material give error into update user
  age: { type: Number, required: false },
  interests: { type: String, required: false },
  biography: { type: String, required: false },
  signType: { type: String, required: true },// for bug login
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }],
  buckets: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]  // check and display lister count
});


userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
