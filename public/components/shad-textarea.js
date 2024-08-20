import { ShadInputText } from "./shad-input-text.js";

class ShadTextarea extends ShadInputText {
    constructor() {
        super();
        const textarea = document.createElement("textarea");
        //textarea.classList.add("input");

        textarea.style.setProperty("resize", "none");
        //textarea.setAttribute("contenteditable", "true");
        this.shadowRoot.querySelector("input").replaceWith(textarea);
        this.input = textarea;
        this.propsToBind = this.propsToBind.filter(prop => prop !== "value");
        const style = document.createElement('style');
        style.textContent = `
          .text-display {
            color: red;
            flex-wrap: wrap;
            column-gap: .15px;
            line-heigh: 1;
            overflow-y: scroll;
            padding: 0;
          }
        `;

        // Create a shadow root and append the style and content
        this.shadowRoot.appendChild(style);
        this.attachListeners();
    }
    connectedCallback() {
        super.connectedCallback();

        this.input.addEventListener("input", () => {
            const display = this.shadowRoot.querySelector(".text-display");
            display.scrollTop = display.scrollHeight;
        })
    }
}
customElements.define("shad-textarea", ShadTextarea);