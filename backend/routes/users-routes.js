const express = require('express');
const { check } = require('express-validator');

const bucketController = require('../controllers/bucket-controllers');
const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.get('/:uid', usersController.getUserById);

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.patch(
  '/:uid',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty()
  ],
  usersController.updateUser
);

router.patch(
  '/account/:uid',
  usersController.updateUserAccount
);

router.post('/login', usersController.login);

router.post("/googlelogin", usersController.googleLogin);
router.post('/facebooklogin', usersController.facebooklogin);     //facebook login

router.post('/forgotPassword', usersController.forgotPassword);


router.get("/bucketlist/:uid", bucketController.getUserBucketList);               // travel bucket list
router.patch("/bucketlist/:pid", bucketController.addPlaceToUserBucketList);
router.delete("/:uid/bucketlist/:pid", bucketController.deletePlaceFromBucketList);

module.exports = router;
