const Router = require('express');
const controller = require("./controller");
const auth = require("./auth-middleware");
const router = Router();

router.get("/", controller.getUsers);
router.post("/", controller.addUser);

router.get("/:id", controller.getUserByID);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

router.post("/checkEmail", auth.validateCredentials, controller.checkEmailForm);
router.post("/register", auth.validateCredentials, controller.addUser);

router.get("/login-form", auth.authenticateToken);
router.post("/authenticate", auth.authenticateToken, controller.authenticate);
router.post("/login", auth.validateCredentials, auth.verifyCredentials, auth.issueTokens);
module.exports = router;