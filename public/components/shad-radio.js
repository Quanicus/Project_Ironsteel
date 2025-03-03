class ShadRadio extends HTMLElement {
    static formAssociated = true; // Enables form association
    static currentChecked = {};

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.internals = this.attachInternals(); // Form API access
        this.shadowRoot.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                }
                :host {
	                display: block;	
                    position: relative;
                    cursor: pointer;
                    width: 16px;
                    height: 16px;
                    justify-items: center;
                    align-content: center;
                    transform: translate(20px, 20px);
                }
                .label {
                    position: absolute;
                    top: 50%;
                    left: calc(100% + .5em);
                    transform: translateY(-50%);
                }
                .radio {
                    width: 100%;
                    height: 100%;
                    border: 1px solid #888888;
                    border-radius: 50%;
                    justify-items: center;
                    align-content: center;
                }
                .fill {
                    width: 65%;
                    height: 65%;
                    border-radius: 50%;
                    background-color: transparent;
                    transition: all 0.2s ease-in-out;
                }
                :host([checked]) .fill {
                    background-color: white;
                }
                :host(:hover) .label {
                    color: gold;
                }
                .circle-container {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: calc(100%);
                    height: calc(100%);
                }
                .circle {
                    fill: none;
                    stroke: white;
                    stroke-width: 4;
                    stroke-dasharray: 145;
                    stroke-dashoffset: 145;
                    transition: stroke-dashoffset .5s ease-in-out;
                }
                :host([checked]) .circle {
                    stroke-dashoffset: 0;
                }
            </style>
            <div class="radio">
                <div class="fill"></div>
            </div>
            <div class="label">
                <slot></slot>
            </div>
            <svg class="circle-container" viewBox="0 0 50 50">
                <circle class="circle" cx="25" cy="25" r="23" />
            </svg>
        `;
    }

    static get observedAttributes() {
        return ["checked"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (name === "checked") {
            this.syncCheckedState();
        }
    }

    connectedCallback() {
        this.addEventListener("click", this.handleClick);
        this.syncCheckedState();
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.handleClick);
    }

    handleClick = () => {
        if (!this.checked) {

            // Check this radio
            this.checked = true;

            // Fire input & change events
            this.dispatchEvent(new Event("input", { bubbles: true }));
            this.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
            this.checked = false;
        }
    };

    syncCheckedState = () => {
        if (this.checked) {
            this.internals.setFormValue(this.value);
            // Uncheck other radios with the same name
            if (ShadRadio.currentChecked[this.name] && ShadRadio.currentChecked[this.name] !== this) {
                ShadRadio.currentChecked[this.name].checked = false;
            }
            ShadRadio.currentChecked[this.name] = this;
        } else {
            this.internals.setFormValue(null);
        }
    };

    get name() {
        return this.getAttribute("name");
    }
    set name(val) {
        this.setAttribute("name", val);
    }

    get value() {
        return this.getAttribute("value");
    }
    set value(val) {
        this.setAttribute("value", val);
    }

    get checked() {
        return this.hasAttribute("checked");
    }
    set checked(val) {
        if (val) {
            this.setAttribute("checked", "");
        } else {
            this.removeAttribute("checked");
        }
    }
}

customElements.define("shad-radio", ShadRadio);
