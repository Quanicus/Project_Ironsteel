class Carousel3d extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: relative;
                    width: 300px;
                    height: 300px;
                    display: inline-block;
                    perspective: 1000px;
                    perspective-origin: 50% -50%;
                }
                .frame-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                }
                ::slotted(*) {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 9px;
                    transition: all 0.3s ease-out;
                    will-change: transform;
                }
                ::slotted(.reflect) {
                    -webkit-box-reflect: below 20px linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%);
                }
                ::slotted(*):hover {
                    translate: x -10%;
                }
                :host(:hover) div {
                }
                .scroll-left, .scroll-right {
                    position: absolute;
                    bottom: -75px;
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
                    left: 30%;
                }
                .scroll-right {
                    right: 30%;
                }
            </style>
            <section class="frame-container">
                <slot></slot>
            </section>
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
        `;

        this.rotateIncrement = 0;
    }
    connectedCallback() {
        const container = this.shadowRoot.querySelector(".frame-container");
        document.addEventListener("DOMContentLoaded", () => {
            const frames = this.children;
            const radius = (frames[0].clientWidth * frames.length) / (1.5 * 3.2);
            this.maxIndex = frames.length - 1;
            this.rotateIncrement = 360 / frames.length;
            
            for (let i = 0; i < frames.length; i++) {
                const frame = frames[i];
                frame.rotation = this.rotateIncrement * i;
                frame.style.transform = `rotateY(${frame.rotation}deg)`;
                frame.style.transformOrigin = `50% 50% -${radius}px`;
                this.applyOpacity(frame);

                const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                if (isSafari) {
                    frame.classList.add("reflect");
                }
            }

            this.shadowRoot.querySelector(".scroll-right").addEventListener("click", () => {
                for (const frame of frames) {
                    frame.rotation += this.rotateIncrement;
                    frame.style.transform = `rotateY(${frame.rotation}deg)`;
                    this.applyOpacity(frame);
                }
            });
            this.shadowRoot.querySelector(".scroll-left").addEventListener("click", () => {
                for (const frame of frames) {
                    frame.rotation -= this.rotateIncrement;
                    frame.style.transform = `rotateY(${frame.rotation}deg)`;
                    this.applyOpacity(frame);
                }
            });
        });
    }
    applyOpacity(frame) {
        const rotation = frame.rotation % 360;

        if (rotation <= 45 || rotation >= 315) {
            frame.style.opacity = "1";
        } else if (rotation <= 90 || rotation >= 270) {
            frame.style.opacity = "0.8";
        } else if (rotation <= 135 || rotation >= 225) {
            frame.style.opacity = "0.6";
        } else {
            frame.style.opacity = "0.4";
        }
    
    }
}
customElements.define("carousel-3d", Carousel3d);
