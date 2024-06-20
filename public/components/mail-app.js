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
                }

                .resize_container {
                    position: relative;
                    display: inline-flex;
                    height: 100%;

                    flex-grow: 1;
                    flex-shrink: 1;
                    width: 500px;

                    .icon_nav {
                        display: flex;
                        flex-direction: column;
                        border: 1px solid #303030;
                        height: 100%;
                                   
                        flex-grow: 0;

                        width: 200px;
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
                    width: 300px;

                    .mail {
                        width: 100%;
                    }
                }
            </style>
           
            <div class="resize_container">
                <div class="icon_nav">
                    <div>
                        <span>O</span>
                        <span>Inbox</span>
                    </div>
                </div>

                <div class="preview_window">
                    <div class="content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                    <div class="resize_handle"></div>
                </div>
            </div>

            

            <div class="mail_display">
                <div class="mail">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </div>
            </div>
        `;
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
        this.nav = shadow.querySelector(".icon_nav");
        this.nav.isCollapsed = false;
        this.resizeContainer = shadow.querySelector(".resize_container");
        this.preview = shadow.querySelector(".preview_window");
        this.display = shadow.querySelector(".mail_display");
        this.handle = shadow.querySelector(".resize_handle");

        
    }
    connectedCallback() {
        const handle = this.handle;
        handle.addEventListener("mousedown", (event) => {
            document.body.style.userSelect = "none";
            document.addEventListener("mousemove", this.resize);
        });
        document.addEventListener("mouseup", () => {
            document.body.style.userSelect = "";
            document.removeEventListener("mousemove", this.resize);
        });
        document.addEventListener("mouseout", () => {
            document.body.style.userSelect = "";
            document.removeEventListener("mousemove", this.resize);
        });
    }
    resize = (event) => {
        const containerRect = this.getBoundingClientRect();
        const resizeContainerRect = this.resizeContainer.getBoundingClientRect();
        const previewRect = this.preview.getBoundingClientRect();
        const displayRect = this.display.getBoundingClientRect();
        const navRect = this.nav.getBoundingClientRect();

        const containerDistanceFromLeft = event.clientX - containerRect.left;
        const containerDistanceFromRight = containerRect.right - event.clientX; 

        
        if (containerDistanceFromRight > 250 && containerDistanceFromLeft > 350 && !this.nav.isCollapsed) {
            this.resizeContainer.style.width = `${containerDistanceFromLeft}px`;
            this.display.style.width = `${containerDistanceFromRight}px`;
        } 
        
        
        
    }
}
customElements.define("mail-app", MailApp);