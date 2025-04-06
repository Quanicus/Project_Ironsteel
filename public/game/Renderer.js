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
        //ctx.strokeRect(position_x, position_y, this.resolution, this.resolution); 
        
        this.drawGoblins();
        this.drawOtherHeros();
        this.drawProjectiles();
        
        this.drawHero(gameState.myHero);
        this.drawHearts(position_x, position_y);
        ctx.restore();
    }

    drawGoblins() {
        gameState.goblins.forEach(goblin => {
            this.drawHero(goblin);
            this.drawHealthBar(goblin);
        });
    }

    drawOtherHeros() {
        gameState.heroesOnline.forEach(hero => {
            if (hero.id === gameState.myHero.id) return;
            this.drawHero(hero);
            this.drawHealthBar(hero);
        });
    }

    drawHero(hero) {
        const ctx = this.canvasContext;
        const sprite = hero.sprite;
        const sWidth = sprite.sourceRectSize.width;
        const sHeight = sprite.sourceRectSize.height;
        const sX = sWidth * sprite.currentFrame.col;
        const sY = sHeight * sprite.currentFrame.row;
        const dX = hero.position_x + sprite.centerOffset.x;
        const dY = hero.position_y + sprite.centerOffset.y;
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

    drawHealthBar(enemy) {
        const ctx = this.canvasContext;
        const position_x = enemy.position_x;
        const position_y = enemy.position_y;
        const percentHealth = enemy.current_hp / enemy.max_hp;
        //const percentHealth = 1;
        ctx.drawImage(resources.images.health.bar_deco,
            0, 0, 64, 17,
            position_x - this.resolution/2, position_y + this.resolution, 2 * this.resolution, this.resolution/2
        );
        ctx.drawImage(resources.images.health.bar,
            0, 0, 47 * percentHealth, 17,
            position_x + 17 - this.resolution/2, position_y + this.resolution, (2 * this.resolution - 19) * percentHealth, this.resolution/2
        );
        
        let heartOffset = 0;
        const hp = enemy.current_hp;
        const hpBreakpoint = (enemy.max_hp - 1) / 3;
        if (hp <= 0) {
            heartOffset = 4;
        } else if (hp <= hpBreakpoint) {
            heartOffset = 3;
        } else if (hp <= hpBreakpoint * 2) {
            heartOffset = 2;
        } else if (hp <= hpBreakpoint * 3) {
            heartOffset = 1;
        }
        ctx.drawImage(resources.images.health.hearts,
            heartOffset * 17, 0, 17, 17,
            position_x - this.resolution/2, position_y + this.resolution, this.resolution/2, this.resolution/2
        );
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
   
        const elevatedImg = resources.images.terrain.elevatedGround;
        const shadowImg = resources.images.terrain.shadow;
        const waterImg = resources.images.terrain.water;
        for (let x = start_x; x < start_x + 30; x++) {
            for (let y = start_y + 17; y >= start_y; y--) {
                //draw tileMatrix[x][y] at position (x*32, y*32) on the canvas
                let tile = null;
                ctx.drawImage(waterImg, 0, 0, resolution, resolution, 
                    x * resolution, y * resolution, resolution + 1, resolution + 1);
               
                if (resources.terrainMatrix[x] && resources.terrainMatrix[x][y]) {
                    tile = resources.terrainMatrix[x][y];
                    const imgElement = resources.images.terrain[tile.type];
                    
                    if (tile.type === "flatGround" && tile.frameStart.x === 0 && tile.frameStart.y === 2) {
                        ctx.drawImage(elevatedImg,
                            0, 64 * 2, 64, 64,
                            x * resolution, y * resolution, resolution + 1, resolution + 1
                        );
                    }
                    if (tile.type === "flatGround" && tile.frameStart.x === 2 && tile.frameStart.y === 2) {
                        ctx.drawImage(elevatedImg,
                            64 * 2, 64 * 2, 64, 64,
                            x * resolution, y * resolution, resolution + 1, resolution + 1
                        );
                    }
                    if (tile.type === "flatGround" && tile.frameStart.x === 0) {
                        ctx.drawImage(shadowImg,
                            2, 64, 64, 64,
                            (x - 1) * resolution, y * resolution, resolution + 1, resolution + 1
                        );
                    }
                    if (tile.type === "elevatedGround" && tile.frameStart.y === 3) {
                        ctx.drawImage(shadowImg,
                            58, 58, 76, 76,
                            x * resolution - 4, y * resolution - 2, resolution + 9, resolution + 9 
                        );
                    }
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

                    const previousTile = resources.terrainMatrix[x-1] ? resources.terrainMatrix[x-1][y] : null;
                    if (previousTile && previousTile.type === "elevatedGround" && 
                        previousTile.frameStart.x === 2 && previousTile.frameStart.y === 3) {
                        ctx.drawImage(shadowImg,
                            128, 64, 64, 64,
                            x * resolution, y * resolution, resolution + 1, resolution + 5
                        );
                    }
                    if (previousTile && previousTile.type === "flatGround" && previousTile.frameStart.x === 2) {
                        ctx.drawImage(shadowImg,
                            128, 64, 64, 64,
                            x * resolution, y * resolution, resolution + 1, resolution + 1
                        );
                    }
                }
                //ctx.drawImage()
                
            }
        }
    }
}
