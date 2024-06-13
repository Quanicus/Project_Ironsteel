const terrainMatrix = require("./generateTerrain.js");
const controller = require("./controller.js");
const auth = require("../users/auth-middleware.js");
const Router = require('express');
const router = Router();

//router.get("/character", controller.getCharacter);
router.get("/resource/terrainMatrix", (req, res) => {
    res.send(terrainMatrix);
});
router.get("/game-key", auth.authenticateToken, controller.issueGameKey);
module.exports = router;