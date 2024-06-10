import Chatbox  from "./Chatbox.js";
import Renderer from "./Renderer.js";
import gameState from "./gameState.js";
import inputManager from "./inputManager.js";

class Game {
    constructor() {
        const resolution = 40;
        const viewWidth = 28 * resolution;
        const viewHeight = 16 * resolution;

        this.display = this.getDisplay();
        this.renderer = new Renderer(this.display, resolution, viewWidth, viewHeight);
        this.chatbox = new Chatbox(this.display);
        this.ws = null;
        this.lastAnimateTime = 0;
        this.animateInterval = 1000 / 10; //100 ms for 10 FPS
        this.running = false;

    }

    animate(timestamp) {
        if (!this.running) return;
        //stage next frame
        requestAnimationFrame(this.animate.bind(this));
        //send held direction to server
        if (inputManager.heldDirectionX[0] || inputManager.heldDirectionY[0]) {
            this.ws.sendMessage("direction", { directionX: inputManager.heldDirectionX[0], directionY: inputManager.heldDirectionY[0]});
        }
        //send bow charge to server
        if (inputManager.isCharging) {
            this.ws.sendMessage("chargeBow", null);
        }
        //animate sprites at every interval, currently set to every 10sec aka 10fps
        if (timestamp - this.lastAnimateTime > this.animateInterval) {
            //increment animation frames of each online hero
            gameState.herosOnline.forEach(hero => {
                const keyFrames = hero.sprite.keyFrames;
                const currentAction = hero.current_action;
                let currentFrame = hero.sprite.currentFrame;
                //if transitioning to another animation, set 
                if (currentAction === "idle" || currentAction === "running") {
                    if (keyFrames[currentAction] && keyFrames[currentAction].animationRow !== currentFrame.row) {
                        currentFrame.row = keyFrames[currentAction].animationRow;
                        currentFrame.col = keyFrames[currentAction].minAnimationCol;
                    }
                    if (keyFrames[currentAction] && currentFrame.col >= keyFrames[currentAction].maxAnimationCol) {
                        currentFrame.col = keyFrames[currentAction].minAnimationCol;
                    } else {
                        currentFrame.col += 1;
                    }
                } else if (currentAction === "chargingBow") {
                    currentFrame.row = keyFrames.chargeBow[hero.direction_aiming].animationRow;//direction facing (like NE or E)
                    currentFrame.col = hero.charge_lvl;//chargelvl
                }
                this.lastAnimateTime = timestamp;
            });
        }

        //update canvas
        this.renderer.updateCanvas();
        //send input
        console.log(gameState.myHero.direction_aiming);
    }

    getDisplay() {
        const display = document.querySelector("app-display");
        const displayElement = display.shadowRoot.querySelector(".display");
        display.app = this;
        display.appIsLoaded = true;
        return displayElement;
    }

    openWebSocket() {
        const url = "ws://localhost:9001/";
        this.ws = new WebSocket("wss://sok.onrender.com");
        // Event handler: WebSocket connection established
        this.ws.onopen = () => {
            console.log('WebSocket connection established');
            inputManager.bindChatbox(this.renderer.canvas, this.chatbox, this.display, this.ws);
            inputManager.bindWASD(this.renderer.canvas, this.ws);
            inputManager.bindBowCharge(this.renderer.canvas, this.ws);
            this.running = true;
            this.animate();
        };
    
        // Event handler: Message received from the server
        this.ws.onmessage = (event) => {
            const serverMsg = JSON.parse(event.data);
            switch (serverMsg.type) {
                case "chat":
                    this.chatbox.postChat(serverMsg);
                    break;
                case "update":
                    gameState.updateState(serverMsg);
                    break;
                default:
                    console.log(serverMsg);
            }
        };
    
        // Event handler: WebSocket connection closed
        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
    
        // Function to send a message to the server
        this.ws.sendMessage = (type, content) => {
            const message = {
                type: type,
                payload: content ?? null, 
            };

            this.ws.send(JSON.stringify(message));
        }
    }
    closeWebSocket() {
        this.ws.close();
        this.running = false;
        //TODO: REMOVE LISTENERS FROM BINDING STUFF IN ONOPEN
    }
}
const game = new Game();





