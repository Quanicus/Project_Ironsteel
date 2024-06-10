import resources from "./resources.js";
import spriteKeyframes from "./spriteKeyframes.js";
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
            centerOffset: {x: -38, y: -38},
            sourceRectSize: {width: 192, height: 192},
            destinationRectSize: {width: 112, height: 112},
        });
        this.keyFrames = spriteKeyframes.archer;
    }
}

export {
    Sprite,
    ArcherSprite,
}