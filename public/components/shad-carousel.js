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
                    overflow: hidden;
                }
                .window {
                    position: relative;
                    width: calc(100% - 100px);
                    height: calc(100% - 40px);
                }
                nav {
                    display: flex;
                    gap: 1em; 
                    height: 40px;
                    align-items: center;
                }
                .scroll-left, .scroll-right {
                    position: absolute;
                    top: calc((100% - 40px)/2);
                    transform: translateY(-50%);
                    border: 1px solid #303030;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                    height: 30px;
                    width: 30px;
                    cursor: pointer;

                    &:hover {
                        background-color: #303030;
                    }
                }
                .scroll-left {
                    left: 0;
                }
                .scroll-right {
                    right: 0;
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
                    border-radius: 9px;
                }
                ::slotted(:first-child) {
                    visibility: visible;
                    opacity: 1;
                }

                ::slotted(.slide-in-left) {
                    animation: shad-carousel-slideInLeft .8s ease-in-out forwards;
                }
                ::slotted(.slide-in-right) {
                    animation: shad-carousel-slideInRight .8s ease-in-out forwards;
                }
                ::slotted(.slide-out-left) {
                    animation: shad-carousel-slideOutLeft .8s ease-in-out forwards;
                }
                ::slotted(.slide-out-right) {
                    animation: shad-carousel-slideOutRight .8s ease-in-out forwards;
                }

            </style>
            <div class="window">
                <slot></slot>
            </div>
            <div class="scroll-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                </svg>
            </div>
            <div class="scroll-right">
                <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                </svg>
            </div>
            <nav></nav>
        `;
        this.keyframes = document.createElement("style");
        this.keyframes.textContent = `
            @keyframes shad-carousel-slideInLeft {
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
            @keyframes shad-carousel-slideInRight {
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
            @keyframes shad-carousel-slideOutLeft {
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
            @keyframes shad-carousel-slideOutRight {
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
        `;
        this.radios = [];
        this.frames = [];
        this.currentFrameIndex = 0;
    }
    connectedCallback() {
        requestAnimationFrame(() => {
            this.frames = Array.from(this.children);
            this.appendChild(this.keyframes);
            this.buildNav();
        });
        this.shadowRoot.querySelector(".scroll-left").addEventListener("click", () => { 
            const newIndex = (this.currentFrameIndex === 0) ? this.frames.length - 1 : this.currentFrameIndex - 1;
            this.scrollLeft(newIndex); 
        });
        this.shadowRoot.querySelector(".scroll-right").addEventListener("click", () => { 
            const newIndex = (this.currentFrameIndex === this.frames.length - 1) ? 0 : this.currentFrameIndex + 1;
            this.scrollRight(newIndex); 
        });
    }
    buildNav() {
        const nav = this.shadowRoot.querySelector("nav");
        for(let index = 0; index < this.frames.length; index++) {
            const frame = this.frames[index];
            const radio = document.createElement("shad-radio");
            radio.name = "nav";
            if (index === 0) radio.checked = true;
            radio.addEventListener("click", () => {
                if (radio.checked) return;
                if (this.currentFrameIndex > index) {
                    this.scrollLeft(index);
                } else {
                    this.scrollRight(index);
                }
            });
            this.radios.push(radio);
            nav.appendChild(radio);
        }
    }
    scrollLeft(newIndex) {
        const currentIndex = this.currentFrameIndex;
        this.removeAnimation(this.frames[currentIndex]);
        this.removeAnimation(this.frames[newIndex]);
        this.frames[currentIndex].classList.add("slide-out-right");
        this.frames[newIndex].classList.add("slide-in-right");
        this.currentFrameIndex = newIndex;
        this.radios[newIndex].checked = true;
    }
    scrollRight(newIndex) {
        const currentIndex = this.currentFrameIndex;
        this.removeAnimation(this.frames[currentIndex]);
        this.removeAnimation(this.frames[newIndex]);
        this.frames[currentIndex].classList.add("slide-out-left");
        this.frames[newIndex].classList.add("slide-in-left");
        this.currentFrameIndex = newIndex;
        this.radios[newIndex].checked = true;
    }
    removeAnimation(element) {
        element.classList.remove("slide-in-left");
        element.classList.remove("slide-in-right");
        element.classList.remove("slide-out-left");
        element.classList.remove("slide-out-right");
    }
}
customElements.define("shad-carousel", ShadCarousel);
