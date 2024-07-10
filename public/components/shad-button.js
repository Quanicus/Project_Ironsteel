class ShadButton extends HTMLElement {
    constructor() {
        super();
        this.eventName = "";
        this.mousedown = false;
        this.colorScheme = {};
    }
    connectedCallback() {
        this.initialize();
        // const eventName = this.getAttribute("data-event");
        // this.eventName = eventName ?? "shad-button-click";
        
        
        this.addListeners();
    }
    initialize() {
        this.initColorScheme();
        const neutrals = this.colorScheme.neutral;
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-size: .75rem;
                    padding: .5rem .75rem;
                    border-radius: 5px;
                    border: 1px solid;
                    cursor: pointer;
                    transition: background-color 0.05s ease-in;
                    user-select: none;

                    background-color: white;
                    border-color: #303030;
                    color: #303030;
                }
            </style>
            <slot></slot>
        `;
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    initColorScheme() {
        const primary = this.getAttribute("data-primary-color") ?? "white";
        const secondary = this.getAttribute("data-secondary-color") ?? "black";
        const accent = this.getAttribute("data-accent-color") ?? "#303030";
        const highlight = this.getAttribute("data-highlight-color") ?? "#D4D4D4";
        const scheme = this.colorScheme;

        scheme.hover = {
            bgColor: highlight,
            bdrColor: secondary,
            txtColor: secondary
        }
        scheme.press = {
            bgColor: secondary,
            bdrColor: primary,
            txtColor: primary
        }
    }
    setColors(colors) {
        const { bgColor, bdrColor, txtColor } = colors;
        this.style.backgroundColor = bgColor;
        this.style.borderColor = bdrColor;
        this.style.color = txtColor;
    }
    resetColors() {
        this.style.removeProperty("background-color");
        this.style.removeProperty("border-color");
        this.style.removeProperty("color");
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
            this.setColors(this.colorScheme.press);
        } else {
            //this.setColors(this.colorScheme.hover);
            this.style.backgroundColor = this.colorScheme.hover.bgColor;
        }
    }
    handleMouseDown = (event) => {
        this.mousedown = true;
        this.setColors(this.colorScheme.press);
    }
    handleMouseUp = () => {
        this.mousedown = false;
        //this.setColors(this.colorScheme.neutral);
        this.resetColors();
    }
    handleMouseOut = () => {
        //this.setColors(this.colorScheme.neutral);
        this.resetColors();
    }

}
customElements.define("shad-button", ShadButton);