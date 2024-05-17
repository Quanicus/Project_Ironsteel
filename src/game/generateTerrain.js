const Vector2 = require("./Vector2");
const wallMatrix = require("./wallMatrix");

function tileFactory({
    type,               //tile type: flatGround, elevatedGround, Water
    frameStart,         //coordinate to start cropping from in sprite map
    frameSize,
    elevation,
    walls
     } ) {
    return {
        type: type,
        frameStart: frameStart ?? new Vector2(0, 0),
        framesize: frameSize ?? new Vector2(32, 32),
        elevation: elevation ?? 0,
        walls: walls ?? wallMatrix[0]
    }
}

const rows = 100;
const cols = 100;
const terrainMatrix = [];

for (let x = 0; x < cols; x++) {
    terrainMatrix[x] = [];
    for (let y = 0; y < rows; y++) {
        if (x < 10 || x > cols - 10 || y < 10 || y > rows - 10) {
            terrainMatrix[x][y] = tileFactory({
                type: "water",
                walls: wallMatrix[4]
            });
        } else {
            terrainMatrix[x][y] = tileFactory({
                type: "flatGround",
                frameStart: new Vector2()
            });
        }
    }
}
module.exports = terrainMatrix;