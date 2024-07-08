const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            position: fixed;
            display: none;
            background-color: white;
            color: #303030;
            font-size: 12px;
            padding: .5rem;
            border: 1px solid #303030;
            border-radius: 5px;
            transform: translateY(-100%);
        }
    </style>
    <slot><slot>
`;
class ShadTooltip extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
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
        const triggerRect = this.parentElement.getBoundingClientRect();
        this.style.top = `${triggerRect.top}px`;
        this.style.left = `${triggerRect.left}px`;
        this.style.display = "block";
    }
    deactivateTooltip = (event) => {
        this.style.display = "none";
    }
    positionTooltip() {

    }
}
customElements.define("shad-tooltip", ShadTooltip);