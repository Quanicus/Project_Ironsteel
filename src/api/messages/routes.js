const Router = require('express');
const controller = require("./controller.js");
const auth = require("../users/auth-middleware.js");
const router = Router();

router.get("/", controller.getMessages);

module.exports = router;