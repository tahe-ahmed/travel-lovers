const express = require('express');

const resetController = require('../controllers/reset-controllers');

const router = express.Router();


router.get('/reset/:token',resetController.resetPassword);
router.post('/forgotPassword',resetController.forgotPassword);

module.exports = router;
