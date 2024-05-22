//import makeChatbox  from "./chatbox.js";
class Game {
    constructor() {
        const viewWidth = 16 * 32 * 2;
        const viewHeight = 9 * 32 * 2;
        const display = this.getDisplay();
        const canvas = this.getCanvas(viewWidth, viewHeight);
        const chatbox = makeChatbox();
        this.wrap = chatbox.querySelector(".scroll-wrap");
        const chatDisplay = chatbox.querySelector(".chat-display");
        const chatInput = chatbox.querySelector("input");

        display.append(canvas, chatbox);

        canvas.addEventListener("keydown", (event) => {
            if(event.key === "Enter") {
                if (chatbox.style.display === "none") {
                    chatbox.style.display = "block";
                    chatbox.querySelector("input").focus();
                } else {
                    chatbox.style.display = "none";
                }
            }
        });

        display.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                chatbox.style.display = "none";
                canvas.focus();
            }
        });

        chatInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && chatInput.value !== "") {
                this.ws.sendMessage("chat", chatInput.value);
                chatbox.querySelector("input").value = "";
            }
        });

        this.ws = null;
        this.canvas = canvas;
        this.canvasContex = canvas.getContext("2d");
        this.chatbox = chatbox;
        this.display = display;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
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

    getDisplay() {
        const display = document.querySelector("app-display");
        const displayElement = display.shadowRoot.querySelector(".display");
        return displayElement;
    }

    openWebSocket() {

        let heldDirectionX = null;
        let heldDirectionY = null;
        const directions = ["w", "a", "s", "d"];

        this.ws = new WebSocket("ws://localhost:9001/");
        // Event handler: WebSocket connection established
        this.ws.onopen = () => {
            console.log('WebSocket connection established');      
            this.canvas.addEventListener("keydown", (event) => {
                /* if(directions.includes(event.key) && !heldDirection.includes(event.key)) {
                    //ws.send(event.key);
                    heldDirection.unshift(event.key);
                    console.log(heldDirection);
                } */
                if ((event.key === "a" || event.key === "d") && heldDirectionX === null) {
                    heldDirectionX = event.key;
                } else if ((event.key === "w" || event.key === "s") && heldDirectionY === null) {
                    heldDirectionY = event.key;
                }
            });
            this.canvas.addEventListener("keyup", (event) => {
                /* if (heldDirection.includes(event.key)) {
                    const index = heldDirection.indexOf(event.key);
                    heldDirection.splice(index, 1);
                    console.log(heldDirection);
                } */
                if (event.key === heldDirectionX) {
                    heldDirectionX = null;
                } else if (event.key === heldDirectionY) {
                    heldDirectionY = null;
                }
            });
        };
    
        // Event handler: Message received from the server
        this.ws.onmessage = (event) => {
            //console.log('Message from server:', event.data);
            /* if (heldDirection.length > 0) {
                this.ws.sendMessage("direction", { direction: heldDirection[0] });
            } */
            if (heldDirectionX || heldDirectionY) {
                this.ws.sendMessage("direction", { directionX: heldDirectionX, directionY: heldDirectionY });
            }
            const msgObj = JSON.parse(event.data);
            //console.log(msgObj);
            switch (msgObj.type) {
                case "chat":
                    this.postChat(msgObj);
                    break;
                case "update":
                    //console.log(msgObj.payload);
                    this.updateCanvas(msgObj.myData);
                    //requestAnimationFrame();
                    break;
                default:
                    console.log(msgObj);
            }
            //REFRESH CANVAS 
            
        };
    
        // Event handler: WebSocket connection closed
        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            //TODO: REMOVE LISTENERS
        };
    
        // Function to send a message to the server
        this.ws.sendMessage = (type, content) => {
            const message = {
                type: type,
                payload: content, 
            };

            this.ws.send(JSON.stringify(message));
        }
    }
    closeWebSocket() {
        this.ws.close();
    }

    postChat(msgObj) {
        const post = document.createElement("div");
        post.setAttribute("class", "chat-msg");
        post.style.flex = "0 0 auto";
        const name = document.createElement("span");
        name.textContent = `${msgObj.name}: `;
        const msg = document.createElement("span");
        msg.textContent = `${msgObj.payload}`;

        post.append(name, msg);
        this.chatbox.querySelector(".chat-display").appendChild(post);
        this.wrap.scrollTop = this.wrap.scrollHeight;
    }

    updateCanvas(characterData, ) {
        const {position_x, position_y} = characterData;
        //console.log(`x: ${position_x}, y: ${position_y}`);
        this.canvasContex.clearRect(0, 0, this.viewWidth, this.viewHeight);
        this.canvasContex.fillRect(position_x, position_y, 32, 32);
    }
}
const game = new Game();


