export default class Chatbox {
    constructor(display) {

        this.element = this.makeChatContainer();
        this.wrap = this.makeScrollWrap();
        this.display = this.makeChatDisplay();
        this.input = this.makeChatInput();
    
        this.wrap.appendChild(this.display);
        this.element.append(this.wrap, this.input);

        display.appendChild(this.element);
    }

    makeChatContainer() {
        const container = document.createElement("div");
        container.setAttribute("class", "chat-container");
        container.style.width = `${16 * 32 - 16}px`;
        //container.style.height = `${6 * 32}px`;
        container.style.position = "absolute";
        container.style.bottom = "16px";
        container.style.left = "12px";
        container.style.display = "none";
        container.style.overflowX = "hidden";
        container.style.overflowY = "auto";
        return container;
    }

    makeScrollWrap() {
        const wrap = document.createElement("div");
        wrap.setAttribute("class", "scroll-wrap");
        wrap.style.backgroundColor = "hsla(210, 100%, 50%, 0.5)";
        wrap.style.height = `${6 * 32}px`;
        wrap.style.overflowY = "auto";
        return wrap;
    }

    makeChatDisplay() {
        const display = document.createElement("div");
        display.setAttribute("class", "chat-display");
        display.style.minHeight = `${6 * 32}px`;
        display.style.display = "flex";
        display.style.flexDirection = "column";
        display.style.justifyContent = "flex-end";
        return display;
    }

    makeChatInput() {
        const chatInput = document.createElement("input");
        chatInput.setAttribute("type", "text");
        chatInput.setAttribute("name", "chatInput");
        chatInput.setAttribute("id", "chatInput");
        chatInput.style.position = "relative";
        chatInput.style.bottom = "0px";   
        chatInput.style.left = "0px";  
        chatInput.style.width = `100%`;;
        return chatInput;    
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
        this.element.querySelector(".chat-display").appendChild(post);
        this.wrap.scrollTop = this.wrap.scrollHeight;
    }
}

