//import makeChatbox  from "./chatbox.js";
class Game {
    constructor() {
        const display = this.getDisplay();
        const canvas = this.getCanvas();
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
        this.chatbox = chatbox;
        this.display = display;
    }

    getCanvas() {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "game-canvas");
        canvas.setAttribute("width", `${16 * 32 * 2}`); //32 x 18 grid of 32x32 tiles
        canvas.setAttribute("height", `${9 * 32 * 2}`);
        canvas.setAttribute("tabindex", "0");
        canvas.style.background = "white";
        return canvas;
    }

    getDisplay() {
        const display = document.querySelector("app-display");
        const displayElement = display.shadowRoot.querySelector(".display");
        return displayElement;
    }

    postChat(msgObj) {
        const post = document.createElement("div");
        post.setAttribute("class", "chat-msg");
        post.style.flex = "0 0 auto";
        const name = document.createElement("span");
        name.textContent = `${msgObj.name}: `;
        const msg = document.createElement("span");
        msg.textContent = `${msgObj.content}`;

        post.append(name, msg);
        this.chatbox.querySelector(".chat-display").appendChild(post);
        this.wrap.scrollTop = this.wrap.scrollHeight;
    }

    openWebSocket() {

        const heldDirection = [];
        const directions = ["w", "a", "s", "d"];

        this.ws = new WebSocket("ws://localhost:9001/");
        // Event handler: WebSocket connection established
        this.ws.onopen = () => {
            console.log('WebSocket connection established');      
            this.canvas.addEventListener("keydown", (event) => {
                if(directions.includes(event.key) && !heldDirection.includes(event.key)) {
                    //ws.send(event.key);
                    heldDirection.unshift(event.key);
                    console.log(heldDirection);
                }
            });
            this.canvas.addEventListener("keyup", (event) => {
                if (heldDirection.includes(event.key)) {
                    const index = heldDirection.indexOf(event.key);
                    heldDirection.splice(index, 1);
                    console.log(heldDirection);
                }
            });
        };
    
        // Event handler: Message received from the server
        this.ws.onmessage = (event) => {
            //console.log('Message from server:', event.data);
            if (heldDirection.length > 0) {
                this.ws.sendMessage("direction", { type: "direction", direction: heldDirection[0] });
            }
            const msgObj = JSON.parse(event.data);
            //console.log(msgObj);
            switch (msgObj.type) {
                case "chat":
                    this.postChat(msgObj);
                    break;
                case "refresh":
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
                content: content, 
            };

            this.ws.send(JSON.stringify(message));
        }
    }
    closeWebSocket() {
        this.ws.close();
    }
}
console.log("ayewtf");
const game = new Game();


