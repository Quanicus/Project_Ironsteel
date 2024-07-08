class ShadButton extends HTMLButtonElement {
    constructor() {
        super();
        this.style.fontSize = ".75rem";
        this.style.padding = ".5rem .75rem";
        this.style.borderRadius = "8px";
        this.style.backgroundColor = "white";
        this.style.border = "1px solid #303030";
        this.style.cursor = "pointer";
        this.eventName = "";
        this.mousedown = false;
    }
    connectedCallback() {
        const eventName = this.getAttribute("data-event");
        this.eventName = eventName ?? "shad-button-click";
        this.addListeners();
    }
    addListeners() {
        this.addEventListener("mouseenter", this.handleMouseIn);
        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mouseleave", this.handleMouseOut);
        document.addEventListener("mouseup", this.handleMouseUp);
        this.addEventListener("click", this.handleClick);
    }
    handleClick = (event) => {
        const clickEvent = new CustomEvent(this.eventName, {
            detail: {target: event.target},
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(clickEvent);
    }
    handleMouseIn = () => {
        if (this.mousedown) {
            this.style.backgroundColor = "black";
            this.style.color = "white";
            this.style.borderColor = "white";
        } else {
            this.style.backgroundColor = "#D4D4D4";
            this.style.color = "black";
            this.style.borderColor = "#303030";
        }
    }
    handleMouseDown = (event) => {
        this.mousedown = true;
        this.style.backgroundColor = "black";
        this.style.color = "white";
        this.style.borderColor = "white";
    }
    handleMouseUp = () => {
        this.mousedown = false;
        this.style.backgroundColor = "white";
        this.style.color = "black";
        this.style.borderColor = "#303030";
    }
    handleMouseOut = () => {
        this.style.backgroundColor = "white";
        this.style.color = "black";
        this.style.borderColor = "#303030";
    }

}
customElements.define("shad-button", ShadButton, {extends: "button"});