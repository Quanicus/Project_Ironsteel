const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            width: 2.3rem;
            height: 1.25rem;
            padding: 0.1rem;
            background-color: #303030;
            transition: background-color 0.2s ease-in;

            & .slider {
                height: 100%;
                border-radius: 50%;
                background-color: black;
                transform: translateX(0);
                transition: all 0.2s ease-in-out;
            }
        }
        :host(:hover) {
            cursor: pointer;
        }
        :host([active]) {
            background-color: white;
            
            & .slider {
                transform: translateX(100%);
            }
        }
        
    </style>
    <div class="slider"><div>
`;
class ShadToggle extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.slider = this.shadowRoot.querySelector(".slider");
    }
    connectedCallback() {
        this.slider.style.width = `${this.slider.clientHeight}px`;
        this.style.borderRadius = `${this.clientHeight/2}px`;
        this.addEventListener("click", this.handleToggle);
    }
    handleToggle = () => {
        this.toggleAttribute("active");
    }
}
customElements.define("shad-toggle", ShadToggle);