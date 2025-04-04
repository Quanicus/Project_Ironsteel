import resources from "./resources.js";
import gameState from "./gameState.js";
import { ArrowSprite } from "./Sprite.js";

export default class Renderer {
    constructor(display, resolution, viewWidth, viewHeight) {        
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.resolution = resolution;
        this.arrowSprite = new ArrowSprite();
        this.canvas = this.getCanvas(viewWidth, viewHeight);
        this.canvasContext = this.canvas.getContext("2d");
        display.appendChild(this.canvas);
    }

    getCanvas(width, height) {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "game-canvas");
        canvas.setAttribute("width", `${width}`); 
        canvas.setAttribute("height", `${height}`);
        canvas.setAttribute("tabindex", "0");
        canvas.style.borderRadius = "9px";
        canvas.style.background = "white";
        return canvas;
    }

    updateCanvas() {
        const myHero = gameState.myHero;
        const {position_x, position_y} = myHero;
        const ctx = this.canvasContext;
        ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);
        ctx.save();
        
        ctx.translate((Math.floor(this.viewWidth/2) - this.resolution/2 - position_x),
                      (Math.floor(this.viewHeight/2) - this.resolution/2 - position_y));
                      
        this.drawTerrain(position_x, position_y);
     
        this.drawOtherHeros();
        this.drawProjectiles();
        
        this.drawHero(gameState.myHero, position_x, position_y);
        this.drawHearts(position_x, position_y);
        ctx.restore();
    }

    drawOtherHeros() {
        gameState.heroesOnline.forEach(hero => {
            if (hero.id === gameState.myHero.id) return;
            const x = hero.position_x;
            const y = hero.position_y;
            this.drawHero(hero, x, y);
            this.drawHealthBar(hero, x, y);
        });
    }

    drawHero(hero, position_x, position_y) {
        const ctx = this.canvasContext;
        const sprite = hero.sprite;
        const sX = sprite.sourceRectSize.width * sprite.currentFrame.col;
        const sY = sprite.sourceRectSize.height * sprite.currentFrame.row;
        const sWidth = sprite.sourceRectSize.width;
        const sHeight = sprite.sourceRectSize.height;
        const dX = position_x + sprite.centerOffset.x;
        const dY = position_y + sprite.centerOffset.y;
        const dWidth = sprite.destinationRectSize.width;
        const dHeight = sprite.destinationRectSize.height;

        //mirror horizontally
        if ((hero.direction_facing === "left" && (hero.current_action === "running" || hero.current_action === "idle"))
            || hero.direction_aiming === "SW" || hero.direction_aiming === "W" || hero.direction_aiming === "NW" ){
            ctx.save();
            ctx.scale(-1,1);
            ctx.drawImage(sprite.img, sX, sY, sWidth, sHeight, -dX - sprite.sourceRectSize.width/2 - this.resolution/2, dY, dWidth, dHeight);
            ctx.restore();
        } else {
            ctx.drawImage(sprite.img, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
        }
        
    }

    drawHealthBar(hero, position_x, position_y) {
        const ctx = this.canvasContext;
        const percentHealth = hero.current_hp / 16;
        //const percentHealth = 1;
        ctx.drawImage(resources.images.health.bar_deco,
            0, 0, 64, 17,
            position_x - this.resolution/2, position_y + this.resolution, 2 * this.resolution, this.resolution/2
        );
        ctx.drawImage(resources.images.health.bar,
            0, 0, 47 * percentHealth, 17,
            position_x + 17 - this.resolution/2, position_y + this.resolution, (2 * this.resolution - 19) * percentHealth, this.resolution/2
        );
        //ctx.strokeRect(position_x, position_y + this.resolution, 4 * this.resolution, this.resolution);
    }

    drawHearts(dX, dY) {
        const ctx = this.canvasContext;
        ctx.drawImage(resources.images.UI.banners.connection_left, 
            0, 0, 128, 192, 
            dX - this.viewWidth/2 + this.resolution, dY - this.viewHeight/2 + this.resolution/2, 2 * this.resolution, 3 * this.resolution
        );
        ctx.drawImage(resources.images.UI.banners.connection_right, 
            64, 0, 128, 192, 
            dX - this.viewWidth/2 + 5 * this.resolution, dY - this.viewHeight/2 + this.resolution/2, 2 * this.resolution, 3 * this.resolution
        );
        ctx.drawImage(resources.images.UI.banners.connection_horizontal, 
            64, 0, 64, 192, 
            dX - this.viewWidth/2 + 3 * this.resolution, dY - this.viewHeight/2 + this.resolution/2, this.resolution, 3 * this.resolution
        );
        ctx.drawImage(resources.images.UI.banners.connection_horizontal, 
            64, 0, 64, 192, 
            dX - this.viewWidth/2 + 4 * this.resolution, dY - this.viewHeight/2 + this.resolution/2, this.resolution, 3 * this.resolution
        );
        
        const health = gameState.myHero.current_hp;
        //const health = 9;
        for (let i = 0; i < 8; i++) {
            let healthOffset = 4;
            if (health >= (i + 1) * 2) {
                healthOffset = 0;
            } else if (health === (i + 1) * 2 - 1) {
                healthOffset = 2;
            }
            ctx.drawImage(resources.images.health.hearts,
                healthOffset * 17, 0, 17, 17,
                dX - this.viewWidth/2 + (2 + i/2) * this.resolution, dY - this.viewHeight/2 + 2 * this.resolution, this.resolution/2, this.resolution/2
            );
        }
        ctx.save();
        //ctx.scale(.25, .25);
        ctx.font = "bold 16px Fraktur";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";  // Outline color
        ctx.lineWidth = 1.5;
        ctx.fillText(`${gameState.myHero.name}`, dX - this.viewWidth/2 + 2 * this.resolution, dY - this.viewHeight/2 + 1.8 * this.resolution);
        ctx.strokeText(`${gameState.myHero.name}`, dX - this.viewWidth/2 + 2 * this.resolution, dY - this.viewHeight/2 + 1.8 * this.resolution);
        ctx.restore();
    }

    drawProjectiles() {
        const ctx = this.canvasContext;
        const sprite = this.arrowSprite;
        const sWidth = sprite.sourceRectSize.width;
        const sHeight = sprite.sourceRectSize.height;
        const dWidth = sprite.destinationRectSize.width;
        const dHeight = sprite.destinationRectSize.height;
        gameState.projectiles.forEach(projectile => {
            const dX = projectile.position_x;
            const dY = projectile.position_y;
            const angle = projectile.shot_angle;
            ctx.save();
            ctx.translate(dX + dWidth/2, dY + dHeight/2);
            ctx.rotate(angle);
            ctx.drawImage(sprite.img, 0, 0, sWidth, sHeight, -dWidth/2, -dHeight/2, dWidth, dHeight);
            ctx.restore();
        });
    }

    drawTerrain(position_x, position_y) {
        const resolution = this.resolution;
        const ctx = this.canvasContext;
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
