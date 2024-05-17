function makeChatbox() {

    function makeChatContainer() {
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

    function makeScrollWrap() {
        const wrap = document.createElement("div");
        wrap.setAttribute("class", "scroll-wrap");
        wrap.style.backgroundColor = "hsla(210, 100%, 50%, 0.5)";
        wrap.style.height = `${6 * 32}px`;
        wrap.style.overflowY = "auto";
        return wrap;
    }

    function makeChatDisplay() {
        const display = document.createElement("div");
        display.setAttribute("class", "chat-display");
        display.style.minHeight = `${6 * 32}px`;
        display.style.display = "flex";
        display.style.flexDirection = "column";
        display.style.justifyContent = "flex-end";
        return display;
    }

    function makeChatInput() {
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

    const container = makeChatContainer();
    const wrap = makeScrollWrap();
    const display = makeChatDisplay();
    const input = makeChatInput();

    wrap.appendChild(display);
    container.append(wrap, input);

    return container;
}
