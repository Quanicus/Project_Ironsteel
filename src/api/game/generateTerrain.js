function tileFactory({
    type,               //tile type: flatGround, elevatedGround, Water
    frameStart,         //coordinate to start cropping from in sprite map
    frameSize,
    elevation,
     } ) {
    return {
        type: type,
        frameStart: frameStart ?? {x: 0, y: 0},
        frameSize: frameSize ?? {x: 64, y: 64},
        elevation: elevation ?? 0,
    }
}

const rows = 30;
const cols = 40;
const terrainMatrix = [];

for (let x = 0; x <= cols; x++) {
    terrainMatrix[x] = [];
    for (let y = 0; y <= rows; y++) {
        if (x < 1 || x > cols - 1 || y < 1 || y > rows - 1) {
            terrainMatrix[x][y] = tileFactory({
                type: "water",
            });
        } else if (x === 2 && y < rows - 12) {//left wall
            terrainMatrix[x][y] = tileFactory({
                type: "flatGround",
                frameStart: {x: 0, y: 1}
            });
        } else if (x === cols - 2 && y < rows - 4) {//right wall
            terrainMatrix[x][y] = tileFactory({
                type: "flatGround",
                frameStart: {x: 2, y: 1}
            });
        } else if (x === 1) {//left beach
            terrainMatrix[x][y] = tileFactory({
                type: "flatGround",
                frameStart: {x: 5, y: 1}
            });
        } else if (x === cols - 1) {//right beach
            terrainMatrix[x][y] = tileFactory({
                type: "flatGround",
                frameStart: {x: 7, y: 1}
            });
        } else if (y === 1) {//top edge
            terrainMatrix[x][y] = tileFactory({
                type: "flatGround",
                frameStart: {x: 1, y: 0}
            });
        } else if (y === rows - 1) {//bottom beach
            terrainMatrix[x][y] =  tileFactory({
                type: "flatGround",
                frameStart: {x: 6, y: 2}
            });
        } else if (x >= 2 && x <= cols - 2 && y === rows - 2) {
            terrainMatrix[x][y] = tileFactory({
                type: "flatGround",
                frameStart: {x: 6, y: 1}
            });
        } else if (x >= 2 && x <= cols - 20 && y >= rows - 10 && y <= rows - 2) {
            terrainMatrix[x][y] = tileFactory({
                type: "flatGround",
                frameStart: {x: 6, y: 1}
            });
        } else if (x === cols - 19 && y >= rows - 10 && y <= rows - 5) {
            terrainMatrix[x][y] = tileFactory({
                type: "flatGround",
                frameStart: {x: 0, y: 1}
            });
        } else {
            terrainMatrix[x][y] = tileFactory({
                type: "flatGround",
                frameStart: {x: 1, y: 1},
            });
        }
    }
}
//bottom left wall
for (let x = 3; x < 13; x++) {
    terrainMatrix[x][rows-12] = tileFactory({
        type: "flatGround",
        frameStart: {x: 1, y: 2}
    });
    terrainMatrix[x][rows-11] = tileFactory({
        type: "elevatedGround",
        frameStart: {x: 1, y: 3},
        frameSize: {x: 65, y: 64}
    });
}
terrainMatrix[13][rows-12] = tileFactory({
    type: "flatGround",
    frameStart: {x: 2, y: 2},
});
terrainMatrix[2][rows-11] = tileFactory({
    type: "elevatedGround",
    frameStart: {x: 0, y: 3},
    frameSize: {x: 65, y: 64}
});
terrainMatrix[13][rows-11] = tileFactory({
    type: "elevatedGround",
    frameStart: {x: 2, y: 3},
    frameSize: {x: 65, y: 64}
});
//bottom right wall 
for (let x = cols - 3; x >= cols - 18; x--) {
    terrainMatrix[x][rows - 4] = tileFactory({
        type: "flatGround",
        frameStart: {x: 1, y: 2}
    });
    terrainMatrix[x][rows - 3] = tileFactory({
        type: "elevatedGround",
        frameStart: {x: 1, y: 3},
        frameSize: {x: 65, y: 64}
    });
}
terrainMatrix[cols-2][rows-3] = tileFactory({
    type: "elevatedGround",
    frameStart: {x: 2, y: 3},
    frameSize: {x: 65, y: 64}
});
terrainMatrix[cols-19][rows-3] = tileFactory({
    type: "elevatedGround",
    frameStart: {x: 0, y: 3},
    frameSize: {x: 65, y: 64}
});
terrainMatrix[cols-19][rows-4] = tileFactory({
    type: "flatGround",
    frameStart: {x: 0, y: 2},
});
//4 corners
terrainMatrix[2][1] = tileFactory({
    type: "flatGround",
    frameStart: {x: 0, y: 0}
});
terrainMatrix[2][rows - 12] = tileFactory({
    type: "flatGround",
    frameStart: {x: 0, y: 2}
});
terrainMatrix[cols - 2][1] = tileFactory({
    type: "flatGround",
    frameStart: {x: 2, y: 0}
});
terrainMatrix[cols - 2][rows - 4] = tileFactory({
    type: "flatGround",
    frameStart: {x: 2, y: 2}
});
module.exports = terrainMatrix;
