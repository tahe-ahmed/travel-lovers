const express = require('express');

const followController = require('../controllers/follow-controller');

const router = express.Router();

router.get('/list/:uid',followController.getList);

router.post('/:uid', followController.follow);
router.post('/unfollow/:uid',followController.unfollow);

module.exports = router;
