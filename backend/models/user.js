const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  gender:{type: String, required: false},
  age:{ type: Number, required: false},
  interests:{type: String, required: false},
  biography:{type: String, required: false},
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);