class IconNav extends HTMLElement {
    constructor() {
        super()
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host  {
                    box-sizing: border-box;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #303030;
                    height: 100%;
                    min-width: min-content;
                    gap: 0.3em;
                    padding: 0.5em;                    
                    max-width: 100%;
                    flex-grow: 1;
                }

                .nav_item {
                    display: flex;
                    align-items: center;
                    padding: .7em;
                    background-color: #303030;
                    border-radius: 6px;

                    & .label {
                        display: inline-flex;
                        justify-content: space-between;
                        width: 100%;
                        margin-left: 0.7em;
                    }
                    & svg {
                        flex-shrink: 0;
                    }
                }
                .handle {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    top: 50%;
                    right: -10px;
                    background-color: red;
                    z-index: 10;
                }
                :host([collapsed]) {
                    
                    & .label {
                        display: none;
                        width: 0;
                    } 
                }
            </style>
            <div class="handle"></div>
        `;
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.nav_items = [];
        this.resizeHandle = this.shadowRoot.querySelector(".handle");
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.widthThreshold = 0;
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            for (let entry of this.children) {
                const svg = entry.querySelector("svg");
                const nav_item = document.createElement("div");
                const data = document.createElement("span");
                const label = document.createElement("div");
                const name = document.createElement("span");

                name.textContent = entry.getAttribute("data-name");
                name.classList.add("name");
                label.classList.add("label");
                nav_item.classList.add("nav_item");
                data.classList.add("data");
                data.textContent = "c:"

                label.append(name, data);
                nav_item.append(svg, label);
                this.nav_items.push(nav_item);
                this.shadowRoot.appendChild(nav_item);

                this.resizeObserver.observe(label);
            }
        });
        this.activateResizeHandle();
    }
    activateResizeHandle() {

        this.resizeHandle.addEventListener("mousedown", (event) => {
            document.body.style.userSelect = "none";
            document.addEventListener("mousemove", this.resize);
        });
        document.addEventListener("mouseup", (event) => {
            document.body.style.userSelect = "";
            document.removeEventListener("mousemove", this.resize);
        });
        document.addEventListener("mouseout", (event) => {
            document.body.style.userSelect = "";
            document.removeEventListener("mousemove", this.resize);
        });
    }
    resize = (event) => {
        const rect = this.getBoundingClientRect();
        const cursorFromLeft = event.clientX - rect.left;
        if (!this.hasAttribute("collapsed")) {
            this.style.width = `${cursorFromLeft}px`;
        } else if (cursorFromLeft > this.widthThreshold) {
            this.style.width = `${cursorFromLeft}px`;
            this.removeAttribute("collapsed");
        }
    };
    handleResize = (entries) => {
        entries.forEach(element => {
            const nameRect = element.target.querySelector(".name").getBoundingClientRect();
            const dataRect = element.target.querySelector(".data").getBoundingClientRect();
            if (dataRect.left - nameRect.right < 1 && !this.hasAttribute("collapsed")) {
                this.widthThreshold = this.getBoundingClientRect().width + 1;
                this.style.width = "0";
                this.setAttribute("collapsed", "true");
                 
            }
            //console.log(element);
        });
    };
}
customElements.define("icon-nav", IconNav);