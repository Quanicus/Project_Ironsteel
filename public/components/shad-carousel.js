class ShadCarousel extends HTMLElement {
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
                    justify-items: center;
                    border: 1px solid red;
                }
                .window {
                    position: relative;
                    width: calc(100% - 40px);
                    height: calc(100% - 30px);
                }
                ::slotted(*) {
                    position: absolute;
                    visibility: hidden;
                    opacity: 0;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 1px solid #303030;
                    border-radius: 5px;
                }
                ::slotted(:first-child) {
                    visibility: visible;
                    opacity: 1;
                }
                ::slotted(.slide-in-left) {
                    animation: slideInLeft 0.3s ease-in-out forwards;
                }
                ::slotted(.slide-in-right) {
                    animation: slideInRight 0.3s ease-in-out forwards;
                }
                ::slotted(.slide-out-left) {
                    animation: slideOutLeft 0.3s ease-in-out forwards;
                }
                ::slotted(.slide-out-right) {
                    animation: slideOutRight 0.3s ease-in-out forwards;
                }

                @keyframes slideInLeft {
                    from { 
                        visibility: hidden;
                        opacity: 0;
                        transform: translateX(-100%); 
                    }
                    to { 
                        visibility: visible;
                        opacity: 1;
                        transform: translateX(0); 
                    }
                }
                @keyframes slideInRight {
                    from { 
                        visibility: hidden;
                        opacity: 0;
                        transform: translateX(100%); 
                    }
                    to { 
                        visibility: visible;
                        opacity: 1;
                        transform: translateX(0); 
                    }
                }
                @keyframes slideOutLeft {
                    from { 
                        visibility: visible;
                        opacity: 1;
                        transform: translateX(0); 
                    }
                    to { 
                        visibility: hidden;
                        opacity: 0;
                        transform: translateX(-100%); 
                    }
                }
                @keyframes slideOutRight {
                    from { 
                        visibility: visible;
                        opacity: 1;
                        transform: translateX(0); 
                    }
                    to { 
                        visibility: hidden;
                        opacity: 0;
                        transform: translateX(100%); 
                    }
                }
            </style>
            <div class="window">
                <slot></slot>
            </div>
            <svg class="scroll-left"></svg>
            <svg class="scroll-left"></svg>
            <nav></nav>
        `;
        this.frames = [];
        this.currentFrameIndex = 0;
    }
    connectedCallback() {
        requestAnimationFrame(() => {
            this.frames = Array.from(this.children);
        });
    }
    scrollLeft() {
        const currentIndex = this.currentFrameIndex;
        const newIndex = (currentIndex === 0) ? this.currentFrameIndex.length - 1 : currentIndex - 1;
        this.removeAnimation(this.frames[currentIndex]);
        this.removeAnimation(this.frames[newIndex]);
        this.frames[currentIndex].classList.add("slide-out-right");
        this.frames[newIndex].classList.add("slide-in-right");
        this.currentFrameIndex = newIndex;
    }
    scrollRight() {
        const currentIndex = this.currentFrameIndex;
        const newIndex = (currentIndex === this.currentFrameIndex.length - 1) ? 0 : currentIndex + 1;
        this.removeAnimation(this.frames[currentIndex]);
        this.removeAnimation(this.frames[newIndex]);
        this.frames[currentIndex].classList.add("slide-out-left");
        this.frames[newIndex].classList.add("slide-in-left");
        this.currentFrameIndex = newIndex;
    }
    removeAnimation(element) {
        element.classList.remove("slide-in-left");
        element.classList.remove("slide-in-right");
        element.classList.remove("slide-out-left");
        element.classList.remove("slide-out-right");
    }
}
customElements.define("shad-carousel", ShadCarousel);