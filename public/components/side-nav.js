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
        .transition-cover {
            position: absolute;
            width: 100vw;
            height: 100vw;
            transform: translateX(-100%);
            transition: transform 0.8s ease-in-out;
            background-color: gold;
            transition-delay: 0.25s;

            &[active] {
                transform: translateX(0);
                transition: transform 0.6s ease-in-out;
            }
        }
        .display {
            position: absolute;
            width: 100vw;
            height: 100vh;
            background-color: black;
            transform: translateX(-100%);
            transition: transform 0.6s ease-in-out;
            transition-delay: 0.25s;
            overflow: hidden;

            &[active] {
                transform: translateX(0);
                transition: transform 0.8s ease-in-out;

                &::after {
                    opacity: 0;
                    transition-delay: 0.8s;
                    pointer-events: none;
                }
            }

            &::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: black;
                opacity: 1;
                z-index: 2;
                transition: opacity 0.25s ease-in-out;
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
        .display.bottom {
            display: grid;
            place-content: center;
        }
        .display.top {
            display: grid;
            place-content: center;
        }
        .close-btn {
            position: absolute;
            display: grid;
            place-content: center;
            width: 2em;
            height: 2em;
            top: 1rem;
            right: 1rem;
            border-radius: 4px;
            background-color: white;
            cursor: pointer;

            & svg {
                width: 1em;
                height: 1em;
            }
        }
        #testput {
            appearance: none;
            padding: 1rem;
            outline: transparent;
            background: black;
            color: gold;
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

    <div class="transition-cover"></div>

    <div class="top display">
        <div class="close-btn">
            <?xml version="1.0" encoding="utf-8"?>
            <!-- License: CC Attribution. Made by Mobirise: https://mobiriseicons.com/ -->
            <svg fill="#000000" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <path d="M29.484 0c-.13.004-.252.057-.343.15L17.164 12.13c-.49.47.235 1.197.706.707L29.846.857c.325-.318.1-.857-.363-.857zM12.488 17c-.13.004-.25.058-.34.15L.162 29.14c-.486.467.233 1.186.7.7L12.848 17.85c.325-.313.093-.85-.36-.85zM.5 0a.5.5 0 0 0-.348.86L29.14 29.845a.5.5 0 1 0 .706-.706L.86.152A.5.5 0 0 0 .5 0z"/>
            </svg>
        </div>
        <slot name="top"></slot>
    </div>

    <div class="main display">
        <div class="control-box">
            <slot name="login"></slot>
            <div class="close-btn">
                <svg fill="#000000" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <path d="M29.484 0c-.13.004-.252.057-.343.15L17.164 12.13c-.49.47.235 1.197.706.707L29.846.857c.325-.318.1-.857-.363-.857zM12.488 17c-.13.004-.25.058-.34.15L.162 29.14c-.486.467.233 1.186.7.7L12.848 17.85c.325-.313.093-.85-.36-.85zM.5 0a.5.5 0 0 0-.348.86L29.14 29.845a.5.5 0 1 0 .706-.706L.86.152A.5.5 0 0 0 .5 0z"/>
            </svg>
            </div>
        </div>
        <slot name="main"></slot>
    </div>

    <div class="bottom display">
        <div class="close-btn"></div>
        <slot name="bottom"></slot>
        <input id="testput" type="email" />
    </div>  
`;
class SideNav extends HTMLElement {
    constructor() {
        super();
        
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));

        this.topBtn = shadow.querySelector(".top-btn");
        this.mainBtn = shadow.querySelector(".main-btn");
        this.bottomBtn = shadow.querySelector(".bottom-btn");
        this.topDisplay = shadow.querySelector(".top");
        this.mainDisplay = shadow.querySelector(".main");
        this.bottomDisplay = shadow.querySelector(".bottom");
        this.transitionCover = shadow.querySelector(".transition-cover");
    }
    connectedCallback() {
        this.createLoginModal();
        this.activateDisplays();
    }
    async createLoginModal() {
        this.htmxModal = document.createElement("htmx-modal");
        this.htmxModal.setAttribute("slot", "login");
        this.htmxModal.setAttribute("id", "login-modal");

        if (await this.checkLoginStatus()) {
            this.handleLoggedIn();
        } else {
            this.handleLoggedOut();
        }
        
        this.appendChild(this.htmxModal);

        this.htmxModal.addEventListener("closed", async (event) => {
            if (await this.checkLoginStatus()) {
                this.handleLoggedIn();
            } else {
                this.handleLoggedOut();
            }
            this.removeChild(this.htmxModal);
            this.appendChild(this.htmxModal);
        });
        
    }
    handleLoggedIn() {
        this.htmxModal.setAttribute("data-label", "Logout");
        this.htmxModal.setAttribute("data-url", "views/logout.html");

        this.querySelectorAll(".login-reactive").forEach(app => {
            //app.dispatchEvent(new Event("logged-in"));
            app.setAttribute("logged-in", "true");
        });
    }
    handleLoggedOut() {
        this.htmxModal.setAttribute("data-label", "Login");
        this.htmxModal.setAttribute("data-url", "views/login.html");

        this.querySelectorAll(".login-reactive").forEach(app => {
            //app.dispatchEvent(new Event("logged-out"));
            app.removeAttribute("logged-in");
        });
    }
    async checkLoginStatus() {
        try {
            const response = await fetch("/api/v1/users/status");
            return response.ok;
        } catch (error) {
            console.log("Error checking login status");
        }
    }
    activateDisplays() {
        this.topBtn.addEventListener("click", () => {
            this.topDisplay.toggleAttribute("active");
            this.transitionCover.setAttribute("active", true);
        });
        this.mainBtn.addEventListener("click", () => {
            this.mainDisplay.toggleAttribute("active");
            this.transitionCover.setAttribute("active", true);
        });
        this.bottomBtn.addEventListener("click", () => {
            this.bottomDisplay.toggleAttribute("active");
            this.transitionCover.setAttribute("active", true);
        });
        const displays = this.shadowRoot.querySelectorAll(".display");
        displays.forEach(display => {
            const closeBtn = display.querySelector(".close-btn");
            closeBtn.addEventListener("click", () => {
                display.toggleAttribute("active");
                this.transitionCover.removeAttribute("active");
            });
        });
    }
}
customElements.define("side-nav", SideNav);
