class TabDisplay extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement("template");
        template.innerHTML = ` 
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    background-color: black;
                }
                button {
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    border: none;
                    padding: 0.5em 1em;
                    border-radius: 1.5em;
                    color: DimGray;
                    background-color: black;

                    &:hover, &[active] {
                        color: white;
                    }
                    &[active] {
                        background-color: #303030;
                    }
                    &:not([active]) {
                        cursor: pointer;
                    }
                }
                ::slotted(section) {
                    display: grid;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    place-items: center;
                    visibility: hidden;
                    opacity: 0;
                    pointer-events: none;
                }
                ::slotted(section[active]) {
                    visibility: visible;
                    opacity: 1;
                    pointer-events: auto;
                }
                .tab_container {
                    display: flex;
                    gap: 1em;
                    padding: 1em;
                }
                .page_container {
                    position: relative;
                    margin: 0 1em 1em 1em;
                    border: 1px solid #303030;
                    border-radius: 8px;
                    flex-grow: 1;
                    overflow: hidden;
                }
            </style>
            <div class="tab_container"></div>
            <div class="page_container">
                <slot></slot>
            </div>
            
        `;
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.tabContainer = this.shadowRoot.querySelector(".tab_container");
        this.pageContainer = this.shadowRoot.querySelector(".page_container");

        this.activeTab = null;
        this.activePage = null;
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            const pages = this.querySelectorAll("section");
            pages.forEach((page, index) => {
                const tabName = page.getAttribute("data-tab-name") ?? `Tab ${index + 1}`;
                const tab = document.createElement("button");
                tab.classList.add("tab");
                tab.textContent = tabName;

                if (index === 0) {
                    this.activePage = page;
                    this.activeTab = tab;
                    page.setAttribute("active", "true");
                    tab.setAttribute("active", "true");
                }
        
                tab.addEventListener("click", () => {
                    this.activeTab.removeAttribute("active");
                    tab.setAttribute("active", "");
                    this.activeTab = tab;

                    this.activePage.removeAttribute("active");
                    page.setAttribute("active", "");
                    this.activePage = page;
                    
                });

                this.tabContainer.appendChild(tab);
            });
        });
    }
}
customElements.define("tab-display", TabDisplay);
