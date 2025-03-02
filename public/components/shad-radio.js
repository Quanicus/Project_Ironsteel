class ShadRadio extends HTMLElement {
    static formAssociated = true; // Enables form association
    static currentChecked = {};

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.internals = this.attachInternals(); // Form API access
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: relative;
                    cursor: pointer;
                    min-width: 16px;
                    min-width: 16px;
                    border: 1px solid red;
                }
                .label {
                    position: absolute;
                    left: 100%;
                }
                .radio {
                    width: 100%;
                    height: 100%;
                    border: 1px solid blue;
                }
            </style>
            <div class="radio"></div>
            <div class="label">
                <slot></slot>
            </div>
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
            // Uncheck other radios with the same name
            document
                .querySelectorAll(`custom-radio[name="${this.getAttribute("name")}"]`)
                .forEach(radio => radio.removeAttribute("checked"));

            // Check this radio
            this.checked = true;

            // Fire input & change events
            this.dispatchEvent(new Event("input", { bubbles: true }));
            this.dispatchEvent(new Event("change", { bubbles: true }));
        }
    };

    syncCheckedState = () => {
        if (this.checked) {
            this.internals.setFormValue(this.value);
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