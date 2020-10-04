const express = require("express");
const notificationsControllers = require("../controllers/notifications-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get('/:rid', notificationsControllers.getNotificationByReceiverId);

router.post('/', notificationsControllers.setNotifications);

router.delete('/:rid', notificationsControllers.deleteNotificationById)
module.exports = router;
