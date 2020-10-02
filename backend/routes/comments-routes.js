const express = require("express");
const { check } = require("express-validator");

const commentsControllers = require("../controllers/comments-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get('/:pid', commentsControllers.getCommentsByPlaceId);

/////// check the authorization /////
// router.use(checkAuth);

router.post(
  "/",
//   [
//     check("content").isLength({ min: 3 }),
//   ],
  commentsControllers.createComment
);

router.delete('/:cid', commentsControllers.deleteComment);

module.exports = router;
