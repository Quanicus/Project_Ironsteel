const Router = require('express');
const controller = require("./controller");
const auth = require("./auth-middleware");
const router = Router();

//router.get("/", controller.getUsers);
router.get("/refreshTokens", controller.getRefreshTokens);
//router.post("/", controller.addUser);

//router.get("/:id", controller.getUserByID);
//router.put("/:id", controller.updateUser);
//router.delete("/:id", controller.deleteUser);

router.post("/checkEmail", auth.validateCredentials, controller.checkEmailForm);
router.post("/register", auth.validateCredentials, controller.addUser);

router.get("/status", auth.authenticateToken, controller.authenticate);
router.post("/login", auth.validateCredentials, auth.verifyCredentials, auth.issueTokens);
router.post("/logout", auth.authenticateToken, auth.logout);
module.exports = router;