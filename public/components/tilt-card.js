class TiltCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    width: 200px;
                    height: 300px;
                    perspective: 1000px;
                }
                .container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                }
                .container::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: var(--shadow-gradient);
                    border-radius: var(--before-border-radius);
                    --shadow-rotation: rotateX(0);
                }
                .container::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    margin: auto;
                    width: calc(100% - 10px);
                    height: calc(100% - 10px);
                    background-color: black;
                    filter: blur(10px);
                    transform: translateZ(-1px);
                    translate: var(--shadow-translate);
                    transform-origin: var(--shadow-origin);
                }
            </style>
            <div class="container">
                <slot></slot>
            </div>
        `;
        this.container = this.shadowRoot.querySelector(".container");
        this.maxTilt = 0.1;
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            this.midpointX = this.clientWidth / 2;
            this.midpointY = this.clientHeight / 2;

            if(this.children.length === 1) {
                const elementStyles = getComputedStyle(this.children[0]);
                const borderRadius = elementStyles.borderRadius;
                this.container.style.setProperty("--before-border-radius", borderRadius);
            }
        });

        this.addEventListener("mouseout", () => {
            this.container.style.transform = "";
            this.container.style.removeProperty("--shadow-gradient");
            this.container.style.removeProperty("--shadow-translate");
            this.container.style.setProperty("transition", "all .5s");
        });
        this.addEventListener("mousemove", (event) => {
            this.container.style.removeProperty("transition");
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            const tiltRatioY = (mouseX - this.midpointX) / this.midpointX;
            const tiltRatioX = (this.midpointY - mouseY) / this.midpointY;
            
            this.container.style.transform = `
                rotateX(${tiltRatioX * this.maxTilt}turn) 
                rotateY(${tiltRatioY * this.maxTilt}turn)
            `;
            this.container.style.setProperty("--shadow-translate", `
                ${-tiltRatioY * 10}px ${tiltRatioX * 10}px
            `);

            let directionX;
            let opacityX;
            if(tiltRatioX > 0) {
                directionX = "to bottom";
                opacityX = .5 * tiltRatioX;
            } else {
                directionX = "to top";
                opacityX = -.5 * tiltRatioX;
            }

            let directionY;
            let opacityY;
            if(tiltRatioY > 0) {
                directionY = "to left";
                opacityY = .5 * tiltRatioY;
            } else {
                directionY = "to right";
                opacityY = -.5 * tiltRatioY;
            }

            this.container.style.setProperty("--shadow-gradient", `
                linear-gradient(${directionX}, rgba(0,0,0,${opacityX}) 0%, transparent 70%, transparent 100%),
                linear-gradient(${directionY}, rgba(0,0,0,${opacityY}) 0%, transparent 70%, transparent 100%)
            `);
        });
    }
}
customElements.define("tilt-card", TiltCard);
