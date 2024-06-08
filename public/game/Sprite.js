import resources from "./resources.js";

class Sprite {
    constructor({
        img,
        currentFrame,
        centerOffset,
        sourceRectSize,
        destinationRectSize,
    }) {
        this.img = img;
        this.currentFrame = currentFrame;
        this.centerOffset = centerOffset;
        this.sourceRectSize = sourceRectSize;
        this.destinationRectSize = destinationRectSize;
    }
}

class ArcherSprite extends Sprite {
    constructor(color) {
        const img = resources.images.factions.archer[color];
        if (!img) {
            throw new Error("No images loaded for archer: ", color);
        }
        super({
            img: img,
            currentFrame: {col: 0, row: 0},
            centerOffset: {x: -38, y: -40},
            sourceRectSize: {width: 192, height: 192},
            destinationRectSize: {width: 112, height: 112},
        });

        this.keyFrames = {
            idle: {
                animationRow: 0,
                minAnimationCol: 0,
                maxAnimationCol: 5
            },
            running: {
                animationRow: 1,
                minAnimationCol: 0,
                maxAnimationCol: 5
            },
            chargeBow: {
                N: { animationRow: 2 },
                NE: { animationRow: 3 },
                E: { animationRow: 4 },
                SE: { animationRow: 5 },

                S: { animationRow: 2 },
                SW: { animationRow: 5 },
                W: { animationRow: 4 },
                NW: { animationRow: 3 },
            },
            fireArrow: {
                N: {
                    animationRow: 2,
                    minAnimationCol: 6,
                    maxAnimationCol: 7
                },
                NE: {
                    animationRow: 3,
                    minAnimationCol: 6,
                    maxAnimationCol: 7
                },
                E: {
                    animationRow: 4,
                    minAnimationCol: 6,
                    maxAnimationCol: 7
                },
                SE: {
                    animationRow: 5,
                    minAnimationCol: 6,
                    maxAnimationCol: 7
                },
            }
        };
    }
}

export {
    Sprite,
    ArcherSprite,
}