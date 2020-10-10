const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Sequelize = require('Sequelize');
const HttpError = require('../models/http-error');

//Sends the reset password to the registered mail address!
const forgotPassword = async (req, res, next) => {
  console.log('bbb');
  if (req.body.email === '') {
    res.status(400).send({ msg: 'email required' });
  }

  User.findOne({ email: req.body.email }, async function (err, user) {
    if (err) throw err;

    if (!user) {
      const error = new HttpError('Email address not found in database!', 403);
      return next(error);
    }

    const token = crypto.randomBytes(20).toString('hex');
    console.log('token');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });

    console.log('userrrr', process.env.EMAIL_ADDRESS);
    console.log('passss', process.env.EMAIL_PASSWORD);
    console.log('url', process.env.APP_URL_BASE);
    const mailOptions = {
      from: `${process.env.EMAIL_ADDRESS}`,
      to: `${user.email}`,
      subject: 'Link To Reset Password',
      text:
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
        ` ${process.env.APP_URL_BASE}/reset/${token} \n\n ` +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('there was an error: ', err);
      } else {
        console.log('here is the res: ', response);
        res.status(200).json('recovery email sent');
      }
    });
    res
      .status(200)
      .json({ msg: 'Your password was reset. Please check your email!' });
  });
};

const resetPassword = async (req, res, next) => {
  const Op = Sequelize.Op;

  const token = req.params.token;
  console.log('tokennnnn', token);
  let user;
  try {
    /* $gt: Date.now() parameter. This is an operator alias comparator, which Sequelize allows me to use
        it’s comparing the current time to the expiration time stamp saved to the database */
    user = await User.find({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    console.log('user', user);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a user.',
      500
    );
    return next(error);
  }

  if (user == null) {
    const error = new HttpError(
        'password reset link is invalid or has expired',
        403
      );
      return next(error);
  } else {
    res
      .status(200)
      .json({ user: user.toObject({ getters: true }), message: 'OK' });
  }
};

exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
