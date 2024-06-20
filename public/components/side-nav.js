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
                }
                ::slotted([slot="middle"]) {
                }
            </style>

            <div class="nav_container">
                <div class="top_btn"></div>
                <div class="main_btn"></div>
                <div class="bottom_btn"></div>
            </div>

            <div class="top display">
                <slot name="top"></slot>
            </div>
            <div class="main display">
                <slot name="main"></slot>
            </div>
            <div class="bottom display">
                <slot name="bottom"></slot>
            </div>

            
        `;
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
        this.topBtn = shadow.querySelector(".top_btn");
        this.mainBtn = shadow.querySelector(".main_btn");
        this.mainDisplay = shadow.querySelector(".main.display");
    }
    connectedCallback() {
        this.topBtn.addEventListener("click", () => {
            eventBus.emit("activate-app", {});
        });
        this.mainBtn.addEventListener("click", () => {
            if(this.mainDisplay.getAttribute("active")) {
                this.mainDisplay.removeAttribute("active");
                this.mainDisplay.style.removeProperty("transform");
            } else {
                this.mainDisplay.setAttribute("active", "true");
                this.mainDisplay.style.setProperty("transform", "translateX(0)");
            }
        });
    }
}
customElements.define("side-nav", SideNav);