class TextReveal extends HTMLElement {
    constructor() {
        super();
        this.revealSpeed = parseInt(this.getAttribute("delay") || 80, 10)
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid #303030;
                    border-radius: 5px;
                }
                .char {
                    opacity: 0;
                    color: gold;
                    transition: color ${this.revealSpeed}ms ease-in;

                    &.reveal {
                        opacity: 1;
                        color: white;
                        animation: cursor ${this.revealSpeed}ms linear;
                    }
                }
                @keyframes cursor {
                    0% {
                        border-right: 1px solid gold;
                    }
                    99% {
                        border-right: 1px solid gold;
                    }
                    100% {
                        border-right: none;
                    }
                }
            </style>
        `; 
        this.characters = []; 
    }

    connectedCallback() {
        this.buildText();
        document.addEventListener("DOMContentLoaded", () =>{
            const observer = this.getIntersectionObserver();
            observer.observe(this);
        });
    }

    buildText() {
        const paragraphs = this.textContent
            .split(/\r\n|\n|\r/)
        .filter(paragraph => paragraph.trim() !== '')
        .map(paragraph => paragraph.trim());

        paragraphs.forEach(paragraph => {
            paragraph.split(" ").forEach(word => {
                this.shadowRoot.appendChild(this.buildWord(word + " "));
            });
            this.shadowRoot.append(document.createElement("br"), document.createElement("br"));
        });
    }

    buildWord(text) {
        const wordElement = document.createElement("span");
        text.split("").forEach(char => {
            const charElement = document.createElement("span");
            charElement.textContent = char;
            charElement.classList.add("char");
            wordElement.appendChild(charElement);
            this.characters.push(charElement);
        });
        return wordElement;
    }
    
    getIntersectionObserver() {
        const container = this.getScrollContainer();
        const midpoint = container.clientHeight / 2;
        const characters = this.characters;

        const options = {
            root: container, 
            rootMargin: `0px 0px -${midpoint}px 0px`,
            threshold: 0.1
        };

        const callback = (entries, observer) => {
            entries.forEach(async (entry) => {
                if (!entry.isIntersecting) return;

                for (const char of characters) {
                    // Do something with the element
                    char.classList.add("reveal");
                    
                    // Wait for the specified delay
                    await new Promise(resolve => setTimeout(resolve, this.revealSpeed));
                }
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
customElements.define("text-reveal", TextReveal);
