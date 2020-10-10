const express = require('express');

const resetController = require('../controllers/reset-controllers');

const router = express.Router();


router.get('/:token',resetController.resetPassword);

router.post('/forgotPassword',resetController.forgotPassword);

router.patch('/updatePasswordViaEmail/:token',resetController.updatePasswordViaEmail);

module.exports = router;