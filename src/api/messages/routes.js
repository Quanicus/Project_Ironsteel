const Router = require('express');
const controller = require("./controller.js");
const auth = require("../users/auth-middleware.js");
const router = Router();

router.get("/recieved", auth.authenticateToken, controller.getRecievedMessages);
router.get("/thread", auth.authenticateToken, controller.getMessageThread);
router.get("/sent", auth.authenticateToken, controller.getSentMessages);

router.post("/send", auth.authenticateToken, controller.sendMessage);
router.post("/readMessage", controller.readMessage);
router.post("/contact-message", controller.sendContactMessage)

module.exports = router;
