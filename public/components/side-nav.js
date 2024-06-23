class SideNav extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    background-color: rgba(0,0,0, 0.5);
                    z-index: 999;
                }
                .nav_container {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    min-width: 30px;
                    width: 4vw;
                    height: 100vh;
                }
                .top_btn, .bottom_btn {
                    height: 4vw;
                    min-height: 30px;
                    border: 1px solid white;
                }
                .main_btn {
                    flex-grow: 1;
                    border: 1px solid white;
                }
                .display {
                    position: absolute;
                    width: 100vw;
                    height: 100vh;
                    background-color: grey;
                    transform: translateX(-100%);
                    transition: transform 0.5s ease-in-out;

                    &[active] {
                        transform: translateX(0);
                    }
                }
                .close_btn {
                    position: absolute;
                    width: 2em;
                    height: 2em;
                    top: 1em;
                    right: 1em;
                    background-color: white;
                }
                ::slotted([slot="top"]) {
                    display: grid;
                    place-content: center;
                    height: 100%;
                }
            </style>

            <div class="nav_container">
                <div class="top_btn"></div>
                <div class="main_btn"></div>
                <div class="bottom_btn"></div>
            </div>

            <div class="top display">
                <div class="close_btn"></div>
                <slot name="top"></slot>
            </div>

            <div class="main display">
                <div class="close_btn"></div>
                <slot name="main"></slot>
            </div>

            <div class="bottom display">
                <div class="close_btn"></div>
                <slot name="bottom"></slot>
            </div>

            
        `;
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));

        this.topBtn = shadow.querySelector(".top_btn");
        this.mainBtn = shadow.querySelector(".main_btn");
        this.bottomBtn = shadow.querySelector(".bottom_btn");
        this.topDisplay = shadow.querySelector(".top");
        this.mainDisplay = shadow.querySelector(".main");
        this.bottomDisplay = shadow.querySelector(".bottom");
    }
    connectedCallback() {
        this.attachDisplays();
    }
    attachDisplays() {
        this.topBtn.addEventListener("click", () => {
            this.topDisplay.toggleAttribute("active");
        });
        this.mainBtn.addEventListener("click", () => {
            this.mainDisplay.toggleAttribute("active");
        });
        this.bottomBtn.addEventListener("click", () => {
            console.log("huh");
            this.bottomDisplay.toggleAttribute("active");
        });
        const displays = this.shadowRoot.querySelectorAll(".display");
        displays.forEach(display => {
            const closeBtn = display.querySelector(".close_btn");
            closeBtn.addEventListener("click", () => {
                display.toggleAttribute("active");
            });
        });
    }
}
customElements.define("side-nav", SideNav);