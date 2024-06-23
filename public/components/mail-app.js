class MailApp extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    position: relative;
                    display: flex;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    font-size: 14px;
                }
                
                .resize_container {
                    position: relative;
                    display: inline-flex;
                    height: 100%;

                    width: 60%;
                    min-width: min-content;
                    
                    & .nav_container {  
                        display: flex;
                        flex-direction: column;          
                        height: 100%;
                        
                        max-width: 250px;
                        flex-grow: 0;
                        

                        & icon-nav {
                            width: 250px;
                        }
                    }

                    .preview_window {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        border: 1px solid #303030;

                        flex-grow: 1;
                        flex-shrink: 0;
                        width: 300px;

                        .resize_handle {
                            position: absolute;
                            right: -10px;
                            top: 50%;
                            width: 20px;
                            height: 20px;
                            background-color: purple;
                            z-index: 10;
                        }

                        .content {
                            width: 100%;
                        }
                    }  
                }  

                .mail_display {
                    position: relative;
                    display: inline-flex;
                    flex-direction: column;
                    height: 100%;
                    border: 1px solid #303030;

                    flex-grow: 1;
                    min-width: 300px;

                    .mail {
                        width: 100%;
                    }
                }
                .header {
                    display: flex;
                    align-items: center;
                    padding: .7em;
                    background-color: #303030;
                    border-radius: 6px;
                    width: 100%;
                }
                
            </style>
           
            <div class="resize_container">
                <div class="nav_container">
                    <icon-nav>
                        <div data-name="Inbox">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-inbox mr-2 h-4 w-4">
                                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                            </svg>
                        </div>
                        <div data-name="Inbox">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-inbox mr-2 h-4 w-4">
                                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                            </svg>
                        </div>
                        <div data-name="Inbox">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-inbox mr-2 h-4 w-4">
                                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                            </svg>
                        </div>
                    </icon-nav>
                </div>

                <div class="preview_window">
                    <div class="header"></div>
                    <div class="content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                    <div class="resize_handle"></div>
                </div>
            </div>

            <div class="mail_display">
                <div class="header"></div>
                <div class="mail">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </div>
            </div>
        `;
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
        this.nav = shadow.querySelector("icon-nav");
        this.nav.isCollapsed = false;
        this.resizeContainer = shadow.querySelector(".resize_container");
        this.navContainer = shadow.querySelector(".nav_container");
        this.preview = shadow.querySelector(".preview_window");
        this.display = shadow.querySelector(".mail_display");
        this.handle = shadow.querySelector(".resize_handle");
        this.navItemLabels = shadow.querySelectorAll(".nav_item div");
        
    }
    connectedCallback() {
        const handle = this.handle;
        handle.addEventListener("mousedown", (event) => {
            document.body.style.userSelect = "none";
            document.addEventListener("mousemove", this.resize);
        });
        document.addEventListener("mouseup", () => {
            this.nav.style.setProperty("width", `${this.nav.getBoundingClientRect().width}px`);
            this.navContainer.style.flexGrow = "0";
            
            document.body.style.userSelect = "";
            document.removeEventListener("mousemove", this.resize);
        });
        document.addEventListener("mouseout", () => {
            document.body.style.userSelect = "";
            document.removeEventListener("mousemove", this.resize);
        });
    }
    resize = (event) => {
        if (this.nav.hasAttribute("collapsed")) {
            this.navContainer.style.flexGrow = "0";
        } else {//${this.nav.widthThreshold}px
            this.nav.style.setProperty("width", `100%`);
            this.navContainer.style.flexGrow = "1";
        }

        const containerRect = this.getBoundingClientRect();

        const containerDistanceFromLeft = event.clientX - containerRect.left;
        const containerDistanceFromRight = containerRect.right - event.clientX; 

        if (containerDistanceFromRight > 250 && containerDistanceFromLeft > 350) {
            this.resizeContainer.style.width = `${containerDistanceFromLeft}px`;
        }  
    }
    
}
customElements.define("mail-app", MailApp);
//this new bug happens when resize-container is resized aka dragged. presumably bc the width attribute is "removed" from icon-nav when we try to set it to 100% presumably bc the nav-container is set to flex-grow: 1;

