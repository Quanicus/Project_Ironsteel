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
                .nav-container {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    min-width: 30px;
                    width: 4vw;
                    height: 100vh;
                    cursor: pointer;
                }
                .top-btn, .bottom-btn {
                    height: 4vw;
                    min-height: 30px;
                    border: 1px solid white;
                }
                .main-btn {
                    display: grid;
                    place-content: center;
                    flex-grow: 1;
                    border: 1px solid white;

                    & path {
                        fill: white;
                    }
                    &:hover path {
                        fill: gold;
                    }
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
                    
                    &.main {
                        & .control-box {
                            display: flex;
                            position: absolute;
                            top: 1rem;
                            right: 1rem;
                            gap: .5rem;
                        
                            & .close-btn {
                                position: static;
                            }
                        }
                    }
                }

                .close-btn {
                    position: absolute;
                    width: 2em;
                    height: 2em;
                    top: 1rem;
                    right: 1rem;
                    background-color: white;
                    cursor: pointer;
                }
                ::slotted([slot="top"]) {
                    display: grid;
                    place-content: center;
                    height: 100%;
                }
            </style>

            <div class="nav-container">
                <div class="top-btn"></div>
                <div class="main-btn">
                    <svg width="50px" height="50px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="icomoon-ignore"></g>
                        <path d="M15.306 2.672h1.066v12.795h-1.066v-12.795z"></path>
                        <path d="M21.17 4.829v1.179c3.881 1.914 6.559 5.912 6.559 10.524 0 6.467-5.261 11.729-11.729 11.729s-11.729-5.261-11.729-11.729c0-4.484 2.53-8.386 6.236-10.359v-1.199c-4.318 2.056-7.302 6.457-7.302 11.558 0 7.066 5.729 12.795 12.795 12.795s12.795-5.729 12.795-12.795c0-5.226-3.135-9.718-7.625-11.704z" ></path>
                    </svg>
                </div>
                <div class="bottom-btn"></div>
            </div>

            <div class="top display">
                <div class="close-btn"></div>
                <slot name="top"></slot>
            </div>

            <div class="main display">
                <div class="control-box">
                    <htmx-modal></htmx-modal>
                    <div class="close-btn"></div>
                </div>
                
                <slot name="main"></slot>
            </div>

            <div class="bottom display">
                <div class="close-btn"></div>
                <slot name="bottom"></slot>
            </div>

            
        `;
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));

        this.topBtn = shadow.querySelector(".top-btn");
        this.mainBtn = shadow.querySelector(".main-btn");
        this.bottomBtn = shadow.querySelector(".bottom-btn");
        this.topDisplay = shadow.querySelector(".top");
        this.mainDisplay = shadow.querySelector(".main");
        this.bottomDisplay = shadow.querySelector(".bottom");
        //TODO: LOGIN
    }
    connectedCallback() {
        this.activateDisplays();
    }
    activateDisplays() {
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
            const closeBtn = display.querySelector(".close-btn");
            closeBtn.addEventListener("click", () => {
                display.toggleAttribute("active");
            });
        });
    }
}
customElements.define("side-nav", SideNav);