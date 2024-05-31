import Chatbox  from "./chatbox.js";
import Renderer from "./Renderer.js";

class Game {
    constructor() {
        const viewWidth = 16 * 32 * 2;
        const viewHeight = 9 * 32 * 2;
        const display = this.getDisplay();
        // experimental
        const renderer = new Renderer(display, viewWidth, viewHeight);
        const chatbox = new Chatbox(display);

        renderer.canvas.addEventListener("keydown", (event) => {
            const chat = chatbox.element;
            if(event.key === "Enter") {
                if (chat.style.display === "none") {
                    chat.style.display = "block";
                    chat.querySelector("input").focus();
                } else {
                    chat.style.display = "none";
                }
            }
        });

        display.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                chatbox.element.style.display = "none";
                renderer.canvas.focus();
            }
        });

        const chatInput = chatbox.input;
        chatInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && chatInput.value !== "") {
                this.ws.sendMessage("chat", chatInput.value);
                chatbox.element.querySelector("input").value = "";
            }
        });

        this.ws = null;
        this.renderer = renderer;
        this.chatbox = chatbox;
    }

    getDisplay() {
        const display = document.querySelector("app-display");
        const displayElement = display.shadowRoot.querySelector(".display");
        display.app = this;
        display.appIsLoaded = true;
        return displayElement;
    }

    openWebSocket() {

        let heldDirectionX = [];
        let heldDirectionY = [];
        const directions = ["w", "a", "s", "d"];

        this.ws = new WebSocket("ws://localhost:9001/");
        // Event handler: WebSocket connection established
        this.ws.onopen = () => {
            console.log('WebSocket connection established');      
            this.renderer.canvas.addEventListener("keydown", (event) => {

                if ((event.key === "a" || event.key === "d") && !heldDirectionX.includes(event.key)) {
                    heldDirectionX.unshift(event.key);
                } else if ((event.key === "w" || event.key === "s") && !heldDirectionY.includes(event.key)) {
                    heldDirectionY.unshift(event.key);
                }
            });
            this.renderer.canvas.addEventListener("keyup", (event) => {
                let index = 0;
                if (event.key === "a" || event.key === "d") {
                    index = heldDirectionX.indexOf(event.key);
                    heldDirectionX.splice(index,1);
                } else if (event.key === "w" || event.key === "s") {
                    index = heldDirectionY.indexOf(event.key);
                    heldDirectionY.splice(index,1);
                }
            });
        };
    
        // Event handler: Message received from the server
        this.ws.onmessage = (event) => {
            if (heldDirectionX[0] || heldDirectionY[0]) {
                this.ws.sendMessage("direction", { directionX: heldDirectionX[0], directionY: heldDirectionY[0]});
            }
            const msgObj = JSON.parse(event.data);
            switch (msgObj.type) {
                case "chat":
                    this.chatbox.postChat(msgObj);
                    break;
                case "update":
                    this.renderer.updateCanvas(msgObj.myData);
                    //this.updateCanvas(msgObj.myData);
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
}
const game = new Game();





