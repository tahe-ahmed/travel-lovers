const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');    // for fetching data from facebook API
const HttpError = require("../models/http-error");
const User = require("../models/user");
const { OAuth2Client } = require('google-auth-library');  //for google login

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId, '-password');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a user.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      'Could not find user for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, age, gender, interests, biography } = req.body;

  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }

  user.name = name;
  user.age = Number(age);
  user.gender = gender;
  user.interests = interests;
  user.biography = biography;
  if (req.file) {
    user.image = req.file.path;
  }

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }
  res.status(200).json({ user: user.toObject({ getters: true }) });
};

/*This function updates email  and password .
  The password is updated if the current password is entered correctly.
  The email is updated if the current password is entered correctly.
  */
const updateUserAccount = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { newEmail, password, newPassword } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
    console.log('isValidPassword', isValidPassword);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid password, please check your password and try again.',
      403
    );
    return next(error);
  }

  if (user && newEmail && isValidPassword) {
    if (user.email === newEmail) {
      const error = new HttpError(
        'Your new email cannot be the same as your current email',
        403
      );
      return next(error);
    }
    user.email = newEmail;
  }
  if (user && newPassword && isValidPassword) {
    const isSamePasswordPrevious = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePasswordPrevious) {
      const error = new HttpError(
        'Your password cannot be the same as your current password',
        403
      );
      return next(error);
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (err) {
      const error = new HttpError(
        'Could not update password, please try again.',
        500
      );
      return next(error);
    }
    user.password = hashedPassword;
  }

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update user.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: user.id,
    email: user.email,
    image: user.image,
    token: token,
  });
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
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

  if (existingUser && existingUser.signType !== "normal") { // for bug
    const error = new HttpError(
      `User exists already, please login with your ${existingUser.signType} account instead.`,
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
    signType: "normal", // for bug
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
  const { email, password, signType } = req.body;

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
  if (existingUser && existingUser.signType !== signType) { // for bug
    const error = new HttpError(
      `User exists already, please login with your ${existingUser.signType} account instead.`,
      422
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
    image:existingUser.image //this image is used to add auth context in frontend side
  });
};

const googleLogin = async (req, res, next) => {
  const client = new OAuth2Client(process.env.GOOGLE_LOGIN_KEY);
  const { email, password, tokenId, signType } = req.body;

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

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Google Logging in failed, please try again later.", 500)
    );
  }



  if (existingUser) {
    // if login
    if (existingUser.signType !== signType) {    //for bug
      const error = new HttpError(
        `User exists already, please login with your ${existingUser.signType} account instead.`,
        422
      );
      return next(error);
    }

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
      signType: "google", //for bug
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


const facebooklogin = async (req, res, next) => {                 // facebook login controller
  const { password, userID, accessToken, signType } = req.body;

  const URL = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

  let facebookData;
  try {
    const response = await fetch(URL);
    facebookData = await response.json();                       // fetch data from facebook API asynchronously
  } catch (err) {
    return next(new HttpError(`ERROR: ${err.message}, Could not get your Facebook data.`, 500));
  }
  let { name, email, picture } = facebookData;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });          //check asynchronously if user has already stored the db 
  } catch (err) {
    return next(new HttpError('Facebook Logging in failed, please try again later.', 500));
  }

  if (existingUser) {                                           // after we sign up the user automatically we let user login with user's facebook account

    if (existingUser.signType !== signType) {    //for bug
      const error = new HttpError(
        `User exists already, please login with your ${existingUser.signType} account instead.`,
        422
      );
      return next(error);
    }
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);  // login user with hashed password
    } catch (err) {
      return next(new HttpError('Could not log your Facebook account in, please check your credentials and try again.', 500));
    }

    if (!isValidPassword) {                                       // basic validator so not need express-validator 
      return next(new HttpError('Could not identify Facebook user, credentials seem to be wrong.', 403));
    }

    let token;
    try {
      token = jwt.sign({
        userId: existingUser.id,
        email: existingUser.email
      },
        process.env.JWT_KEY,
        { expiresIn: "7d" });
    } catch (err) {
      return next(new HttpError('Facebook Log in failed, please try again.', 500));
    }

    res.json({ userId: existingUser.id, email: existingUser.email, token: token });
  } else {                                            // we sign up the user automatically with user's facebook data
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);         // hashing the user password
    } catch (err) {
      return next(new HttpError('Could not creat a user with your Facebook account, please try again.', 500));
    }

    const createdUser = new User({                    // creating a new user with facebook data
      name,
      email,
      image: picture.data.url,          // connecting users to image url. this part different from usual
      password: hashedPassword,
      signType: "facebook",//for bug
      places: []
    });

    try {
      await createdUser.save();                       // save db created user
    } catch (err) {
      return next(new HttpError('Facebook Signing up failed, please try again.', 500));
    }

    let token;                                        //generating token for browser
    try {
      token = jwt.sign({
        userId: createdUser.id,
        email: createdUser.email
      },
        process.env.JWT_KEY,
        { expiresIn: "7d" });                         // expires in as long as possible
    } catch (error) {
      return next(new HttpError('Facebook Signing up failed, please try again.', 500));
    }
    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });      //send data from backend to frontend
  }

};
exports.updateUserAccount = updateUserAccount;
exports.updateUser = updateUser;
exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.googleLogin = googleLogin;
exports.facebooklogin = facebooklogin;
