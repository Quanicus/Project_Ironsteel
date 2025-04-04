const terrainMatrix = require("./generateTerrain.js");
const controller = require("./controller.js");
const auth = require("../users/auth-middleware.js");
const Router = require('express');
const router = Router();

//router.get("/character", controller.getCharacter);
router.get("/resource/terrainMatrix", (req, res) => {
    res.send(terrainMatrix);
});
router.get("/verify-character", controller.verifyCharacter);
router.post("/make-character", controller.makeCharacter);

module.exports = router;
