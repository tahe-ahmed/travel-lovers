const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

const googleLogin = async (req, res, next) => {
  const client = new OAuth2Client(process.env.GOOGLE_LOGIN_KEY);
  const { email, password, tokenId } = req.body;

  let googleData;
  try {
    googleData = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_LOGIN_KEY,
    });
  } catch (err) {
    return next(
      new HttpError(
        `ERROR: ${err.message}, Could not get your Google data.`,
        500
      )
    );
  }
  console.log(googleData);

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Google Logging in failed, please try again later.", 500)
    );
  }

  // console.log(existingUser);

  if (existingUser) {
    // if login
    let isValidPassword = false; // 175 login user with hashed password
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password); // check new inputted password string to hashed password which is in db
    } catch (err) {
      return next(
        new HttpError(
          "Could not log your Google account in, please check your credentials and try again.",
          500
        )
      );
    }

    if (!isValidPassword) {
      // basic validator so not need express-validator
      return next(
        new HttpError(
          "Could not identify Google user, credentials seem to be wrong.",
          403
        )
      );
    }

    let token;
    try {
      token = jwt.sign(
        {
          userId: existingUser.id,
          email: existingUser.email,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      return next(
        new HttpError("Google Log in failed, please try again.", 500)
      );
    }
    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    });
  } else {
    // if signup

    let hashedPassword; // 174 hashing the user password
    try {
      hashedPassword = await bcrypt.hash(password, 12); // number of salting around is 12
    } catch (err) {
      return next(
        new HttpError(
          "Could not creat a user with your Facebook account, please try again.",
          500
        )
      );
    }

    const createdUser = new User({
      name: googleData.payload.name,
      email: googleData.payload.email,
      image: googleData.payload.picture, // 166 connecting users to image
      password: hashedPassword,
      places: [],
    });

    try {
      await createdUser.save();
    } catch (err) {
      return next(
        new HttpError("Google Signing up failed, please try again.", 500)
      );
    }

    let token; //176- generating token
    try {
      token = jwt.sign(
        {
          userId: createdUser.id,
          email: createdUser.email,
        },
        process.env.JWT_KEY,
        { expiresIn: "7d" }
      );
    } catch (err) {
      return next(
        new HttpError("Google Signing up failed, please try again.", 500)
      );
    }

    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token: token }); //176- generating token
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.googleLogin = googleLogin;
