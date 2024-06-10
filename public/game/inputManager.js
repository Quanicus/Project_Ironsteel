import gameState from "./gameState.js";

class InputManager {
    constructor() {
        this.heldDirectionX = [];
        this.heldDirectionY = [];
        this.isCharging = false;
    }

    bindWASD(app, ws) {
        app.addEventListener("keydown", (event) => {
            if ((event.key === "a" || event.key === "d") && !this.heldDirectionX.includes(event.key)) {
                this.heldDirectionX.unshift(event.key);
            } else if ((event.key === "w" || event.key === "s") && !this.heldDirectionY.includes(event.key)) {
                this.heldDirectionY.unshift(event.key);
            }
        });
        app.addEventListener("keyup", (event) => {
            let index = 0;
            if (event.key === "a" || event.key === "d") {
                index = this.heldDirectionX.indexOf(event.key);
                this.heldDirectionX.splice(index,1);
            } else if (event.key === "w" || event.key === "s") {
                index = this.heldDirectionY.indexOf(event.key);
                this.heldDirectionY.splice(index,1);
            }
            if (this.heldDirectionX.length === 0 && this.heldDirectionY.length === 0) {
                ws.sendMessage("idle");
            }
        });
    }

    bindChatbox(canvas, chatbox, display, ws) {
        canvas.addEventListener("keydown", (event) => {
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
                canvas.focus();
            }
        });

        const chatInput = chatbox.input;
        chatInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && chatInput.value !== "") {
                ws.sendMessage("chat", chatInput.value);
                chatbox.element.querySelector("input").value = "";
            }
        });
    }

    bindBowCharge(canvas, ws) {
        canvas.addEventListener("mousedown", (event) => {
            this.isCharging = true;
            ws.sendMessage("startCharge", {x: event.offsetX, y: event.offsetY, displayWidth: canvas.width, displayHeight: canvas.height});
            canvas.addEventListener("mousemove", aimBow);
        });
        canvas.addEventListener("mouseup", (event) => {
            this.isCharging = false;
            ws.sendMessage("releaseBow", {x: event.offsetX, y: event.offsetY, displayWidth: canvas.width, displayHeight: canvas.height});
            canvas.removeEventListener("mousemove", aimBow);
        });
        function aimBow(event) {
            //console.log("aiming");
            ws.sendMessage("aimBow", {x: event.offsetX, y: event.offsetY, displayWidth: canvas.width, displayHeight: canvas.height});
        }
    }
     
    releaseBow() {
        this.isCharging = false;
    }
}
const inputManager = new InputManager();
export default inputManager;