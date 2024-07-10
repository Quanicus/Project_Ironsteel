const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            position: fixed;
            display: block;
            background-color: white;
            color: #303030;
            font-size: 12px;
            padding: .5rem;
            border: 1px solid #303030;
            border-radius: 5px;
            transform: translateY(-100%);
            transition: opacity 0.2s ease-in;
            opacity: 0;
        }
    </style>
    <slot><slot>
`;
class ShadTooltip extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: "open"});
        this.style.opacity = "0";
    }
    connectedCallback() {
        this.formatTriggerElement();
        this.positionTooltip();
    }
    formatTriggerElement() {
        const triggerElement = this.parentElement;
        const computedTriggerStyle = window.getComputedStyle(triggerElement);
        if (computedTriggerStyle.position === "static") {
            triggerElement.style.position = "relative";
        }
        triggerElement.addEventListener("mouseover", this.activateTooltip);
        triggerElement.addEventListener("mouseout", this.deactivateTooltip);

    }
    activateTooltip = (event) => {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.style.opacity = "1";
        const triggerRect = this.parentElement.getBoundingClientRect();
        const tooltipRect = this.getBoundingClientRect();
        this.style.top = `${triggerRect.top}px`;
        this.style.left = `${triggerRect.left - tooltipRect.width/2 + triggerRect.width/2}px`;
        
    }
    deactivateTooltip = (event) => {
        this.shadowRoot.innerHTML = "";
        this.style.opacity = "0";
    }
    positionTooltip() {

    }
}
customElements.define("shad-tooltip", ShadTooltip);