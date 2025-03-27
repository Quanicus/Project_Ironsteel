class FlipCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                    width: 300px;
                    height: 400px;
                    perspective: 1000px;
                }
                .content-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 1s ease-in-out;
                }
                :host(:hover) .content-container {
                    transform: rotateY(.5turn);
                }
                .content-container > * {
                    position: absolute;
                    display: grid;
                    place-items: center;
                    inset: 0;
                    border-radius: 9px;
                    padding: 2em;
                    overflow: hidden;
                }
                .back-container {
                    background-color: white; 
                    color: black;
                    transform: scaleX(-1) translateZ(-20px);
                }
                .front-container {
                    background-color: #303030;
                    transform: translateZ(20px);
                }
                .back-border{
                    transform: translateZ(-60px);
                    border: 1px solid #303030;
                    margin: 2em;
                }
                .front-border{
                    transform: translateZ(60px);
                    border: 1px solid white;
                    margin: 2em;
                }
            </style>
            <div class="content-container">
                <div class="back-border"></div>
                <div class="back-container">
                    <slot name="back"></slot>
                </div>
                
                <div class="front-container">
                    <slot name="front"></slot>
                </div>
                <div class="front-border"></div>
            </div>
        `;
    }
}
customElements.define("flip-card", FlipCard);
