const template = document.createElement("template");
template.innerHTML = `
    <style>
        * {
            box-sizing: border-box;
        }
        :host {
            position: relative;
            display: block;
            font-size: 12px;
            padding: .5rem;
            cursor: text;
        }
        :host([type]) {
            width: 150px;
        }
        input {
            all: unset;
            position: relative;
            width: 100%;
            height: 100%;
            z-index: 2;
        }
        .text-display {
            position: absolute;
            display: flex;
            align-items: center;
            padding-inline: .5rem;
            top: 0;
            left: 0;
            border: 1px solid #303030;
            border-radius: 5px;
            width: 100%;
            height: 100%;
            background-color: grey;
            overflow: auto;
        }
    </style>
    <div class="text-display">
        <span>j</span><span>f</span><span>&nbsp;</span><span>f</span><span>j</span><span>f</span>
    </div>
    <input/>
    
`;
class ShadInputText extends HTMLElement {

    static formAssociated = true;
    //static emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
    static emailRegex = "^[^@]+@[^@]+\.[^@]+$";
    static inputTypes = ['text', 'password', 'email', 'search', 'tel', 'url'];

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._internals = this.attachInternals();

        this.display = this.shadowRoot.querySelector(".text-display");
        this.input = this.shadowRoot.querySelector("input");

        this.addEventListener("click", () => this.input.focus());
        this.bubbleEvents(['change', 'input', 'focus', 'blur']);
    }

    bubbleEvents(events) {
        events.forEach(eventName => {
            this.input.addEventListener(eventName, (originalEvent) => {
                // Create a new custom event
                const customEvent = new CustomEvent(eventName, {
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    detail: {
                        originalEvent: originalEvent
                    }
                });

                this.dispatchEvent(customEvent);
            });
        });
    }
    
    static get observedAttributes() {
        return ['type', 'placeholder', 'disabled', 'required', 'maxlength', 'minlength', 'pattern', 'readonly', 'autocomplete', 'autofocus', 'name', 'size'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {//mostly serves to initialize shadow input attributes
            if (name === "type") {
                if (!ShadInputText.inputTypes.includes(newValue)) {
                    throw new Error("shad-input-text can only be of types:", ShadInputText.inputTypes);
                } else if (newValue === "email") {
                    this.input.pattern = ShadInputText.emailRegex
                    newValue = "text";
                }
            } 
            this.input[name] = newValue;
        }
    }

    connectedCallback() {
        const input = this.input;
        this._internals.setValidity(input.validity, input.validationMessage);
        
        this.tabIndex = this.getAttribute("tabindex") ?? "-1";
        this._proxyInput();
    }

    _proxyInput() {//getters and setters reroute to the shadow input
        const input = this.input;
        const propsToBind = ['value', 'placeholder', 'disabled', 'required', 'maxlength',
            'minlength', 'pattern', 'readonly', 'autocomplete', 'autofocus',
            'name', 'size',];

        propsToBind.forEach(prop => {
            Object.defineProperty(this, prop, {
                get: () => input[prop],
                set: (newValue) => input[prop] = newValue,
                enumerable: true,
                configurable: true
            });
        });

        input.addEventListener('input', this.updateInputValue);
        input.addEventListener("paste", this.handlePaste);
        // input.addEventListener('mouseup', this.captureSelection);
        // input.addEventListener('mousemove', this.captureSelection);
        // input.addEventListener('keyup', this.captureSelection);  
    }
    updateInputValue = (event) => {
        const input = this.input;
        if (input.value && !input.validity.valid) {
            input.setCustomValidity("Please enter a valid Email address.");
        } else {
            input.setCustomValidity("");
        }
        this._internals.setFormValue(input.value);
        this._internals.setValidity(input.validity, input.validationMessage);
        
        // const insertedString = event.data;
        // if (insertedString) {
        //     console.log(insertedString);
        // } else {
        //     //chars deleted -> trim
        // }
    }
    handlePaste = (event) => {
        event.preventDefault();
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData("text");
        //...          
    }
    captureSelection = (event) => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            console.log('Text highlighted:', selectedText);
        }
    }
    
    // Form-related methods
    formAssociatedCallback(form) {
        // Called when the element is associated with a form
        this.form = form;
    }

    formDisabledCallback(disabled) {
        // Called when the element is disabled/enabled
        this.input.disabled = disabled;
    }

    formResetCallback() {
        // Called when the form is reset
        this.value = '';
    }

    formStateRestoreCallback(state, mode) {
        // Called when the browser restores the form state
        this.value = state;
    }
}
customElements.define("shad-input-text", ShadInputText);