class SideNav extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    display: flex;
                    flex-direction: column;
                    top: 0;
                    min-width: 30px;
                    width: 4vw;
                    height: 100vh;
                    background-color: rgba(0,0,0, 0.5);
                    z-index: 999;
                }
                .top, .bottom {
                    height: 4vw;
                    border: 1px solid white;
                }
                .main {
                    flex-grow: 1;
                    border: 1px solid white;
                }
                ::slotted([slot="middle"]) {
                    display: block;
                    height: 100%;
                }
            </style>
            <div class="top"></div>
            <div class="main">
                <slot name="middle"></slot>
            </div>
            <div class="bottom"></div>
        `;
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
        this.main = shadow.querySelector(".main");
    }
    connectedCallback() {
        this.main.addEventListener("click", () => {
            eventBus.emit("activate-app", {});
        });
    }
}
customElements.define("side-nav", SideNav);