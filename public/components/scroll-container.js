class ScrollContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .scrollbar-container {
                    position: absolute;
                    display: grid;
                    place-items: center;
                    top: 0;
                    right: 0;
                    height: 100%;
                    width: 2em;
                    border: 1px solid #303030;
                }
                .scrollbar {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 1em;
                    gap: .5em; 
                }
                .page-button {
                    color: #696969;
                    cursor: pointer;
    
                    &[status="close"] {
                        color: #696969;
                    }
                    &[status="open"] {
                        color: white;
                    }
                    &:hover {
                        color: gold;
                    }
                }
                .page-scrollbar {
                    width: 3px;
                    border: 1px solid #696969;
                    border-radius: 3px;
                    
                    &[status="open"] {
                        height: 50px;
                    }
                    &[status="close"] {
                        height: 10px;
                    }
                }
                .page-position {
                    width: 3px;
                    background-color: white;
                    border-radius: 3px;
                }
                .content-container::-webkit-scrollbar {
                    display: none;
                }
                .content-container {
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    scrollbar-width: none;
                }
                ::slotted([scroll-page]) {
                    width: 100%;
                    min-height: 100%;
                    border: 1px solid red;
                }
            </style>
            <section class="content-container">
                <slot></slot>
            </section>
            <nav class="scrollbar-container">
                <div class="scrollbar"></div>
            </nav>
        `;
        this.content = this.shadowRoot.querySelector(".content-container");
        this.scrollbar = this.shadowRoot.querySelector(".scrollbar");
        this.content.addEventListener("scroll", () => {
            this.updateScrollbar();
        });
        this.pages = [];
        this.pageScrollbars = [];
        this.pageEnd = null;
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            this.pages = Array.from(this.querySelectorAll("[scroll-page]"));
            this.buildScrollbar();
        });
    }
    buildScrollbar() {
        const numPages = this.pages.length;
        for (let i = 0; i < this.pages.length; i++) {
            const pageButton = this.makePageButton(i);
            
            if (i === this.pages.length - 1) {
                if (this.pages[i].offsetHeight > this.content.clientHeight) {
                    this.scrollbar.appendChild(pageButton);
                    this.scrollbar.appendChild(this.makePageScrollbar());
                    this.scrollbar.appendChild(this.makeScrollEnd());
                    this.pageScrollbars[i].button = pageButton;
                } else {
                    this.scrollbar.appendChild(this.makeScrollEnd());
                }
            } else {
                this.scrollbar.appendChild(pageButton);
                this.scrollbar.appendChild(this.makePageScrollbar());
                this.pageScrollbars[i].button = pageButton;
            }

        }
    }
    makePageButton(pageNum) {
        const button = document.createElement("div");
        button.classList.add("page-button");
        button.textContent = (pageNum < 10) ? `0${pageNum}` : pageNum;

        button.addEventListener("click", () => {
            this.pages[pageNum].scrollIntoView({behavior: "smooth", block: "start"});
        });

        return button;
    }
    makePageScrollbar() {
        const pageScrollbar = document.createElement("div");
        pageScrollbar.classList.add("page-scrollbar");
        pageScrollbar.setAttribute("status", "close");
        
        const pagePosition = document.createElement("div");
        pagePosition.classList.add("page-position");
        pagePosition.style.height = "0px";
        
        this.pageScrollbars.push({scrollbar: pageScrollbar, position: pagePosition});
        pageScrollbar.appendChild(pagePosition);
        return pageScrollbar;
    }
    makeScrollEnd() {
        const endButton = document.createElement("div");
        endButton.classList.add("page-button");
        endButton.textContent = "❖";
        endButton.style.fontSize = "1.8em";
        endButton.style.transform = "translateY(-0.3em)";
        const endPosition = this.content.scrollHeight - this.clientHeight;

        endButton.addEventListener("click", () => {
            this.content.scrollTo({top: endPosition, behavior: "smooth"});    
        });

        this.pageEnd = endButton;
        return endButton;
    }
    updateScrollbar() {
        const containerRect = this.content.getBoundingClientRect();

        for (let i = 0; i < this.pages.length; i++) {
            const pageRect = this.pages[i].getBoundingClientRect();
            
            if (containerRect.top - pageRect.bottom >= -1) {// scrolled past page
                this.pageScrollbars[i].button.setAttribute("status", "close");
                this.pageScrollbars[i].scrollbar.setAttribute("status", "close");
                this.pageScrollbars[i].position.style.height = "100%";
            } else if (containerRect.top - pageRect.top < -1) {// page below container
                if (this.pageScrollbars[i]) {
                    if (this.pageScrollbars[i].scrollbar) {
                        this.pageScrollbars[i].button.setAttribute("status", "close");
                        this.pageScrollbars[i].scrollbar.setAttribute("status", "close");
                    }
                    this.pageScrollbars[i].position.style.height = "0px";
                }
            } else {
                if (this.pageScrollbars[i]) {
                    this.pageScrollbars[i].button.setAttribute("status", "open");
                    this.pageScrollbars[i].scrollbar.setAttribute("status", "open");
                    if (i === this.pages.length - 1) {
                        this.pageScrollbars[i].position.style.height = `${(containerRect.top - pageRect.top) / (this.pages[i].offsetHeight - this.content.clientHeight) * 100}%`; 
                    } else {
                        this.pageScrollbars[i].position.style.height = `${(containerRect.top - pageRect.top) / this.pages[i].offsetHeight * 100}%`; 
                    }
                }
            }
        }
        if (this.content.scrollTop + this.content.clientHeight >= this.content.scrollHeight - 1) {
            this.pageEnd.setAttribute("status", "open");
        } else {
            this.pageEnd.setAttribute("status", "close");
        }
    }
}
customElements.define("scroll-container", ScrollContainer);
