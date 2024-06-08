import resources from "./resources.js";
import gameState from "./gameState.js";

export default class Renderer {
    constructor(display, resolution, viewWidth, viewHeight) {        
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.resolution = resolution;
        this.canvas = this.getCanvas(viewWidth, viewHeight);
        this.canvasContex = this.canvas.getContext("2d");
        display.appendChild(this.canvas);
    }

    getCanvas(width, height) {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "game-canvas");
        canvas.setAttribute("width", `${width}`); 
        canvas.setAttribute("height", `${height}`);
        canvas.setAttribute("tabindex", "0");
        canvas.style.background = "white";
        return canvas;
    }

    updateCanvas() {
        //TODO NOW: convert serverMsg source to gameState
        const myHero = gameState.myHero;
        const {position_x, position_y} = myHero;
        const ctx = this.canvasContex;
        ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);
        ctx.save();
        
        ctx.translate((Math.floor(this.viewWidth/2) - this.resolution/2 - position_x),
                      (Math.floor(this.viewHeight/2) - this.resolution/2 - position_y));
                      
        this.drawTerrain(position_x, position_y);
     
        ctx.fillRect(position_x, position_y, this.resolution, this.resolution);
        
        this.drawOtherHeros();
        
        this.drawHero(gameState.myHero, position_x, position_y);
        ctx.restore();
    }

    drawOtherHeros() {
        gameState.herosOnline.forEach(hero => {
            if (hero.id === gameState.myHero.id) return;
            const x = hero.position_x;
            const y = hero.position_y;
            this.drawHero(hero, x, y);
        });
    }

    drawHero(hero, position_x, position_y) {
        
        const sprite = hero.sprite;
        const sX = sprite.sourceRectSize.width * sprite.currentFrame.col;
        const sY = sprite.sourceRectSize.height * sprite.currentFrame.row;
        const sWidth = sprite.sourceRectSize.width;
        const sHeight = sprite.sourceRectSize.height;
        const dX = position_x + sprite.centerOffset.x;
        const dY = position_y + sprite.centerOffset.y;
        const dWidth = sprite.destinationRectSize.width;
        const dHeight = sprite.destinationRectSize.height;

        if ((hero.direction_facing === "left" && (hero.current_action === "running" || hero.current_action === "idle"))
            || hero.direction_aiming === "SW" || hero.direction_aiming === "W" || hero.direction_aiming === "NW" ){
            this.canvasContex.save();
            this.canvasContex.scale(-1,1);
            this.canvasContex.drawImage(sprite.img, sX, sY, sWidth, sHeight, -dX - sprite.sourceRectSize.width/2 - this.resolution/2, dY, dWidth, dHeight);
            this.canvasContex.restore();
        } else {
            this.canvasContex.drawImage(sprite.img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
        }
        
    }

    drawTerrain(position_x, position_y) {
        const resolution = this.resolution;
        const ctx = this.canvasContex;
        if (!resources.terrainIsLoaded) return;

        //calculate window based on player position.
        const tile_x = Math.floor(position_x/resolution);
        const tile_y = Math.floor(position_y/resolution);
        const sub_x = position_x % resolution;
        const sub_y = position_y % resolution;
        const start_x = tile_x - 14;
        const start_y = tile_y - 8;

        for (let x = start_x; x < start_x + 30; x++) {
            for (let y = start_y; y < start_y + 18; y++) {
                //draw tileMatrix[x][y] at position (x*32, y*32) on the canvas
                let tile = null;
                if (x < 0 || y < 0 || x >= resources.terrainMatrix.length || y >= resources.terrainMatrix[0].length) {
                    tile = {
                        type: "water",
                        frameStart: {x: 0, y: 0},
                        frameSize: {x: resolution, y: resolution},
                        elevation: 0,
                        walls: ["N","S","E","W"],
                        scale: 1
                    };
                } else {
                    tile = resources.terrainMatrix[x][y];
                }
                
                const imgElement = resources.images.terrain[tile.type];

                ctx.drawImage(
                    imgElement, 
                    tile.frameStart.x * tile.frameSize.x,
                    tile.frameStart.y * tile.frameSize.y,
                    tile.frameSize.x,
                    tile.frameSize.y,
                    x * resolution,
                    y * resolution,
                    resolution+1,
                    resolution+1
                );
                //ctx.drawImage()
                
            }
        }
    }
}