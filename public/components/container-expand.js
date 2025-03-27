class ContainerExpand extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    padding: 8px;
                    width: fit-content;
                }
                .corner {
                    position: absolute;
                    width: 35px;
                    height: 35px;
                    transition: transform .3s ease-in-out .8s;

                    &.left {
                        top: 0;
                        left: 0;
                        border-top: 3px solid white;
                        border-left: 3px solid white;
                        transform: translate(6.5px, 6.5px);
                    }
                    &.right {
                        bottom: 0;
                        right: 0;
                        border-bottom: 3px solid white;
                        border-right: 3px solid white;
                        transform: translate(-6.5px, -6.5px);
                    }
                    &[reveal] {
                        transform: translate(0, 0);
                    }
                }
                .content-container {
                    overflow: hidden;
                    width: fit-content;
                    transition: all .8s ease-in-out;
                }
                .content-container[reveal="false"] {
                    width: 0;
                    height: 0;
                    opacity: 0;
                }
                .content-container[reveal="true"] {
                    border: 1px solid white;
                    padding: 5px;
                    opacity: 1;
                }
            </style>
            <div class="corner right"></div>
            <div class="corner left"></div>
            <div class="content-container">
                <slot></slot>
            </div>
        `;
        this.contentContainer = this.shadowRoot.querySelector(".content-container");
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            this.contentHeight = this.contentContainer.clientHeight;
            this.contentWidth = this.contentContainer.clientWidth;
            this.contentContainer.setAttribute("reveal", "false");
            const observer = this.getIntersectionObserver();
            observer.observe(this);
        });
    }
    
    getIntersectionObserver() {
        const container = this.getScrollContainer();
        
        const options = {
            root: container, 
            rootMargin: `0px 0px -${this.contentHeight + 50}px 0px`,
            threshold: 0.1
        };

        const callback = (entries, observer) => {
            entries.forEach(async (entry) => {
                if (!entry.isIntersecting) return;
                this.contentContainer.setAttribute("reveal", "true");
                this.contentContainer.style.width = `${this.contentWidth}px`;
                this.contentContainer.style.height = `${this.contentHeight}px`;
                this.shadowRoot.querySelector(".left").setAttribute("reveal", "");
                this.shadowRoot.querySelector(".right").setAttribute("reveal", "");
                observer.unobserve(entry.target);
            });
        };

        return new IntersectionObserver(callback, options);
    }

    getScrollContainer() {
        let current = this.parentElement;

        while (current) {
            if (this.isScrollable(current)) {
                return current;
            }
            // If the element is slotted, jump to the <slot> in the shadow DOM
            if (current.assignedSlot) {
                current = current.assignedSlot;
                continue;
            }

            // If we're in a shadow DOM and haven't found the scroller, move up the shadow tree
            if (current.getRootNode() instanceof ShadowRoot && current !== current.getRootNode().host) {
                current = current.parentElement || current.getRootNode().host;
                continue;
            }

            // Move up the light DOM or to the shadow host if at the root
            current = current.parentElement || (current instanceof ShadowRoot ? current.host : null);
        }
        return document.scrollingElement || document.documentElement;
    }

    isScrollable(element) {
        const style = window.getComputedStyle(element);
        const overflow = style.overflow;
        const overflowY = style.overflowY;

        return overflowY === 'scroll' || overflowY === 'auto' || overflow === 'scroll' || overflow === 'auto';
    }
}
customElements.define("container-expand", ContainerExpand);
