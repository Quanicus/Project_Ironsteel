class ParallaxCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: relative;
                    display: inline-block;
                    width: 225px;
                    height: 337px;
                    cursor: pointer;
                    perspective: 1000px;

                    --timing: 350ms;
                }
                .shadow {
                    position: absolute;
                    left: 50%;
                    width: 95%;
                    height: 100%;
                    background-color: black;
                    filter: blur(20px);
                    opacity: 0;
                    transform: translate(-50%, 0px);
                    transition: all var(--timing) ease-in-out;
                }
                :host(:hover) .shadow {
                    transform: translate(-50%, 40px);
                    rotate: x 40deg;
                    opacity: 1;
                }
                ::slotted(img) {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    right: 0;
                    left: 0;
                    margin: 0 auto;
                    object-fit: contain;
                    object-position: 50% 100%;
                    transition: all var(--timing) ease-in-out;
                }
                :host(:hover) ::slotted([slot="background"]) {
                    rotate: x 30deg;
                }
                ::slotted([slot="background"])::after {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 75%;
                    background: linear-gradient(to bottom, rgba(0,0,0,.75), transparent);
                    opacity: 0;
                    transition: all var(--timing) ease-in-out;
                }
                :host(:hover) ::slotted([slot="background"])::after {
                    opacity: 1;
                }
                ::slotted([slot="foreground"]) {
                    opacity: 0;
                }
                :host(:hover) ::slotted([slot="foreground"]) {
                    transform: translate3d(0%, -20%, 50px);
                    opacity: 1;
                }
                :host(:hover) ::slotted([slot="logo"]) {
                    transform: translateY(-10%);
                }
            </style>
            <div class="shadow"></div>
            <slot name="background"></slot>
            <slot name="foreground"></slot>
            <slot name="logo"></slot>
        `;
    }

    connectedCallback() {
    }
}
customElements.define("parallax-card", ParallaxCard);
