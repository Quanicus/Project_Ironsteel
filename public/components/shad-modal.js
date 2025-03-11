class ShadModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                .overlay {
                    position: fixed;
                    display: grid;
                    place-items: center;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0,0,0,0.7);
                    visibility: hidden;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.8s ease-in-out;
                    
                    &[status="open"] {
                        visibility: visible;
                        opacity: 1;
                        pointer-events: auto;
                    }
                    &[status="close"] {
                        visibility: hidden;
                        opacity: 0;
                        pointer-events: none;
                    }
                }
                .open-button {
                    display: grid;
                    place-items: center;
                    font-size: 0.75em;
                    padding: 1em;
                    border: 1px solid #303030;
                    border-radius: 9px;
                    cursor: pointer;
                    
                    &:hover {
                        background-color: #303030;
                    }

                    &:active {
                        border-color: white;
                        background-color: black;
                    }
                }
                .close-button {
                    position: absolute;
                    display: grid;
                    place-items: center;
                    top: 1em;
                    right: 1em;
                    border-radius: 5px;
                    color: #909090;
                    cursor: pointer;

                    &:hover {
                        color: white;
                    }

                    &:active {
                        border: 1px solid white;
                        box-shadow: 0px 0px 10px 3px white;
                    }
                }
                .content {
                    position: relative;
                    display: grid;
                    place-items: center;
                    gap: 1em;
                    min-width: 30vw;
                    min-height: 30vh;
                    border: 1px solid #303030;
                    border-radius: 9px;
                    background-color: black;

                    [status="open"] & {
                        animation: modalSlideIn 0.6s ease-in-out forwards;
                    } 
                    [status="close"] & {
                        animation: modalSlideOut 0.6s ease-in-out forwards;
                    } 
                }
                @keyframes modalSlideIn {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes modalSlideOut {
                    from {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                }
            </style>
            <section class="overlay">
                <div class="content">
                    <slot></slot>
                    <div class="close-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </div>
                </div>
            </section>
            <div class="open-button">Modal</div>
        `;
        this.overlay = this.shadowRoot.querySelector(".overlay");
        const closeButton = this.shadowRoot.querySelector(".close-button");
        const button = this.shadowRoot.querySelector(".open-button"); 
        button.textContent = this.getAttribute("label");

        button.addEventListener("click", () => {
            this.overlay.setAttribute("status", "open");
        });

        closeButton.addEventListener("click", () => {
            this.overlay.setAttribute("status", "close");
        });

        this.overlay.addEventListener("click", (event) => {
            if (event.target === this.overlay) {
                this.overlay.setAttribute("status", "close");
            }
        });
    }
    connectedCallback() {
        const cancelButton = this.querySelector('[type="cancel"]');
        if (cancelButton) {
            cancelButton.addEventListener("click", ()  => {
                this.overlay.setAttribute("status", "close");
            });
        }
        const submitButton = this.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener("click", ()  => {
                this.overlay.setAttribute("status", "close");
            });
        }
    }
}
customElements.define("shad-modal", ShadModal);
