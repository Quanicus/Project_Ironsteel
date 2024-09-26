import { ShadButton } from "./shad-button.js";
const template = document.createElement("template");
template.innerHTML = `
    <style>
        dialog {
            position: relative;
            opacity: 0;
            border: 1px solid white;
            border-radius: 5px;
            outline: none;
            min-width: 300px;
            min-height: 200px;
            background-color: black;
            color: white;
            place-content: center;
            transform: translateX(150px);
            transition: all 0.35s ease-in;
            overflow: visible;
            cursor: auto;
            gap: 0.5em;

            &.show {
                opacity: 1;
                transform: translateX(0);
            }

            &::backdrop {
                background-color: transparent;
                transition: background-color 0.35s linear;
            }
            &.show::backdrop {
                background-color: rgba(0,0,0,0.8); 
            }
        }
        .close-button {
            position: absolute;
            right: 1em;
            top: 1em;
        }
    </style>
    <dialog>
        <slot name="modal"></slot>
        <shad-button class="close-button">X</shad-button>
    </dialog>
`;
class ShadModal extends ShadButton {
    constructor() {
        super();
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.dialog = this.shadowRoot.querySelector("dialog");
        this.dialog.addEventListener("click", (event) => event.stopPropagation());
        this.dialog.addEventListener("mousedown", (event) => event.stopPropagation());
        this.shadowRoot.querySelector(".close-button").addEventListener("click", this.close);
        this.addEventListener("click", this.showModal);
        this.addEventListener("htmx:afterRequest", (event) => {
            const xhr = event.detail.xhr;
            const status = xhr.status;
            this.querySelector("form").reset();

            if (status >= 200 && status < 300) {
                this.close();
            } else {
                // The request failed (status code outside 2xx range)
                console.log('Request failed with status:', status);
            }
        });
    }
    connectedCallback() {
        super.connectedCallback();

    }
    showModal = () => {
        const dialog = this.dialog;
        dialog.showModal();
        dialog.classList.add("show");
        dialog.style.display = "grid";
    }
    close = () => {
        const dialog = this.dialog;
        dialog.style.transform = "translateX(-150px)";
        dialog.classList.remove("show");

        const transitionEndHandler = (event) => {
            if (event.propertyName === "opacity") {
                dialog.style.removeProperty("display");
                dialog.style.removeProperty("transform");
                dialog.close();
                dialog.removeEventListener('transitionend', transitionEndHandler);
            }
        };
        dialog.addEventListener('transitionend', transitionEndHandler);

    }
}
customElements.define("shad-modal", ShadModal);