import resources from "./resources.js";
export default class Renderer {
    constructor(display, viewWidth, viewHeight) {        
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.canvas = this.getCanvas(viewWidth, viewHeight);
        this.canvasContex = this.canvas.getContext("2d");
        display.appendChild(this.canvas);
    }

    getCanvas(width, height) {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "game-canvas");
        canvas.setAttribute("width", `${width}`); //32 x 18 grid of 32x32 tiles
        canvas.setAttribute("height", `${height}`);
        canvas.setAttribute("tabindex", "0");
        canvas.style.background = "white";
        return canvas;
    }

    updateCanvas(msgObj) {
        //position_x + tile.frameSize.x/2 - innerWidth/2 = shift amount 
        const {position_x, position_y} = msgObj.myData;
        const ctx = this.canvasContex;
        ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);
        ctx.save();
        ctx.translate(-(position_x + 224 - innerWidth/2), -(position_y + 96 - Math.floor(innerHeight/2)));
        this.drawTerrain(position_x, position_y);
        //console.log(`x: ${position_x}, y: ${position_y}`);
        //TODO: DRAW OTHER PLAYERS
        ctx.fillRect(position_x, position_y, 32, 32);
        //this.drawMyCharacter(position_x, position_y);
        this.drawPlayers(msgObj.playersOnline, msgObj.myData.id, position_x, position_y);
        ctx.restore();
    }

    drawMyCharacter(position_x, position_y) {
        const ctx = this.canvasContex;
        const img = resources.images.factions.red.archer;
        ctx.drawImage(img,64,64, 128,128, position_x,position_y, 64,64);
    }

    drawPlayers(playersOnline, myId, position_x, position_y){
        const ctx = this.canvasContex;
        let img = null;
        playersOnline.forEach(player => {
            if (player.id === myId) {
                img = resources.images.factions.blue.archer;
            } else {
                img = resources.images.factions.red.archer;
            }
            //draw player in his location
            const x = player.position_x;
            const y = player.position_y;
            ctx.drawImage(img, 32,32, 128,128, x-16,y-16, 64,64);
        });
    }

    drawTerrain(position_x, position_y) {
        const ctx = this.canvasContex;
        if (!resources.terrainIsLoaded) return;

        //calculate window based on player position.
        const tile_x = Math.floor(position_x/32);
        const tile_y = Math.floor(position_y/32);
        const sub_x = position_x % 32;
        const sub_y = position_y % 32;
        const start_x = tile_x - 17;
        const start_y = tile_y - 10;

        for (let x = start_x; x < start_x + 36; x++) {
            for (let y = start_y; y < start_y + 22; y++) {
                //draw tileMatrix[x][y] at position (x*32, y*32) on the canvas
                
                let tile = null;
                if (x < 0 || y < 0 || x >= resources.terrainMatrix.length || y >= resources.terrainMatrix[0].length) {
                    tile = {
                        type: "water",
                        frameStart: {x: 0, y: 0},
                        frameSize: {x: 32, y: 32},
                        elevation: 0,
                        walls: ["N","S","E","W"],
                        scale: 1
                    };
                } else {
                    //console.log(x, y);
                    tile = resources.terrainMatrix[x][y];
                }
                
                const imgElement = resources.images.terrain[tile.type];
                //console.log(resources.terrainMatrix[x][y], imgElement);
                //position_x/y + char size/2 = distance from 0,0 to center of char.
                //innerHeight/width/2 = distance from SW viewport to center of char
                //position_x + tile.frameSize.x/2 - innerWidth/2 = shift amount 
                ctx.drawImage(
                    imgElement, 
                    tile.frameStart.x * tile.frameSize.x,
                    tile.frameStart.y * tile.frameSize.y,
                    tile.frameSize.x * tile.scale,
                    tile.frameSize.y * tile.scale,
                    x * tile.frameSize.x,
                    y * tile.frameSize.y,
                    tile.frameSize.x,
                    tile.frameSize.y
                );
                //ctx.drawImage()
                
            }
        }
    }
}