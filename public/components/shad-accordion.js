class ShadAccordion extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                border-bottom: 1px solid #303030;
                interpolate-size: allow-keywords;
                overflow: hidden;
                cursor: pointer;
            }
            .panel {
                display: flex;
                justify-content: space-between;
                align-content: center;
                padding: 1.5em 0;
                
                &:hover {
                    text-decoration: underline;
                    text-decoration-color: gold;
                }
            }
            ::slotted([slot="content"]) {
                height: 0;
                transition: all 0.2s ease-in-out;
            }
            [expanded] +  ::slotted([slot="content"]) {
                padding-bottom: 1em;
                height: auto;
            }
            svg {
                width: 1.2em;
                height: 1.2em;
                stroke: #A0A0A0;
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
                transition: transform 0.2s ease-in-out;

                :hover & {
                    stroke: gold;
                }
                [expanded] & {
                    stroke: white;
                    transform: rotate(180deg);
                }
            }
        </style>
        <div class="panel">
            <svg xmlns="http://www.w3.org/2000/svg" class="chevron"  viewBox="0 0 24 24">
                <path d="m6 9 6 6 6-6"></path>
            </svg>
        </div>
        <slot name="content"></slot>
        `;
        this.panel = this.shadowRoot.querySelector(".panel");
        this.panel.addEventListener("click", () => {
            this.panel.toggleAttribute("expanded");
        });
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            const panel = this.querySelector('[slot="panel"]');
            this.panel.prepend(panel.textContent);
        });
    }
}
customElements.define("shad-accordion", ShadAccordion);
