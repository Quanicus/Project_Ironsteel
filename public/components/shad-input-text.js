const template = document.createElement("template");
template.innerHTML = `
    <style>
        * {
            box-sizing: border-box;
        }
        :host {
            position: relative;
            display: block;
            font-size: 14px;
            padding: .5rem;
            cursor: text;
        }
        :host([type]) {
            width: 150px;
        }
        :host([type="password"]) {
            & input {
                letter-spacing: 5px;
            }
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
            overflow-x: scroll;

            &.active {
                border-color: white;
            }
            & span {
                position: relative;
                animation: drop-in .2s forwards;
                flex-shrink: 0;

                .active &.caret::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    width: 1px;
                    height: 100%;
                    background-color: gold;
                    animation: blink 1s step-end infinite;
                }
                &.selected {
                    background-color: yellow;
                }
            }
        }
        @keyframes drop-in {
            from {
                transform: translateY(-.5rem);
                opacity: 0;
            }
        }
        @keyframes blink {
            from, to {
                visibility: visible;
            }
            50% {
                visibility: hidden;
            }
        }
        input {
            all: unset;
            position: relative;
            width: 100%;
            height: 100%;

            &::selection {
                background: transparent;
            }
            background: transparent;
            color: transparent;
        }

    </style>
    <input spellcheck="false"/>
    <div class="text-display"></div>
    
    
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
        this.currentSelection = {
            start: 0, 
            end: 0,
            isSelected: function(){return this.start !== this.end}
        }
        this.selectedCards = [];
        this._caretElement = this.initCaret();

        this.addEventListener("click", () => this.input.focus());
        //this.bubbleEvents(['change', 'input', 'focus', 'blur']);
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
    get caretElement() { return this._caretElement; }
    set caretElement(caret) {
        if (this._caretElement === caret) return;
        this._caretElement.classList.remove("caret");
        console.log("attempting to add caret: ", caret);
        if (caret) {
            console.log("adding caret ", caret);
            caret.classList.add("caret");
        }
        this._caretElement = caret;
    }

    static get observedAttributes() {
        return ['type', 'disabled', 'required', 'maxlength', 'minlength', 'pattern', 'readonly', 'autocomplete', 'autofocus', 'name', 'size'];
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
        this.attachListeners();
        this.display.splice = function(string) {

        }
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
    }
    attachListeners() {
        const input = this.input;
        input.addEventListener("beforeinput", this.handleBeforeInput);
        input.addEventListener('input', this.handleAfterInput);
        input.addEventListener("scroll", this.syncScroll);
        input.addEventListener("click", this.captureSelection);
        input.addEventListener("mousedown", this.startSelecting);
        input.addEventListener('mouseup', this.captureSelection);
        input.addEventListener('keyup', this.captureSelection);
        // input.addEventListener("paste", this.handlePaste);
        
        this.addEventListener("focus", () => {
            console.log("custom focused");
            this.display.classList.add("active");
            this.input.style.zIndex = "2";
        })
        input.addEventListener("focus", () => {
            console.log("shadow focused");
        })
        this.addEventListener("blur", () => {
            console.log("custom blur");
            this.display.classList.remove("active");
            this.input.style.zIndex = "0";
        })
        input.addEventListener("blur", () => {
            console.log("shadow blur");
        })
    }
    handleBeforeInput = (event) => {
        const display = this.display;
        const input = this.input;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selectedText = input.value.substring(start, end);

        console.log("indicies before input: ", start, end);
        //console.log(event.inputType);
        if (selectedText) {
            this.selectedCards.forEach(card => this.display.removeChild(card));
            this.caretElement = this.display.children[start];
        }
        switch (event.inputType){
            case "insertText":
                const text = event.data;
                //add inserted text into container starting at start
                display.insertBefore(this.makeCharCard(text),this.caretElement);
                
                break;
            case "deleteContentBackward":
                if (!selectedText) {
                    //remove charCards[start - 1]
                    display.removeChild(display.children[start - 1]);    
                }
                break;
            case "insertFromPaste":
                //add pasted text to display container
                const pasteText = event.data;
                break;
        }
    }
    handleAfterInput = (event) => {
       
        const input = this.input;
        if (input.value.length !== this.display.childElementCount - 1) {
            this.display.replaceChildren(...this.syncInput());
        }
        //console.log(input.value);
        if (this.getAttribute("type") === "email" && input.value && !input.validity.valid) {
            input.setCustomValidity("Please enter a valid Email address.");
        } else {
            input.setCustomValidity("");
        }
        this._internals.setFormValue(input.value);
        this._internals.setValidity(input.validity, input.validationMessage);
        
        //console.log("caret after input: ", this.input.selectionStart);
        //establish new caret position 
        console.log("after input ", this.input.selectionStart);
        // const newCaret = this.display.children[this.input.selectionStart];
        // this.caretElement = newCaret;
        console.log(this.caretElement);
        //this.captureSelection();
    }
    syncScroll = () => {
        this.display.scrollLeft = this.input.scrollLeft;
    }
    syncInput() {
        const input = this.input.value;
    }
    startSelecting = (event) => {
        const input = this.input;
        input.addEventListener("mousemove", this.captureSelection);
        document.addEventListener("mouseup", () => {
            input.removeEventListener("mousemove", this.captureSelection);
        })
    }
    captureSelection = (event) => {
        const input = this.input;
              
        const start = input.selectionStart;
        const end = input.selectionEnd;
        if (start !== end) {//if text selected
            //this.caretElement.classList.remove("caret");
            this.selectText(start, end);
        } else if (start){
            this.selectText();
            //update caret position
            this.caretElement = this.display.children[start]
        }
    }

    initCaret() {
        const caret = this.makeCharCard();
        if (this.getAttribute("type") === "password") {
            caret.innerHTML = "&nbsp;";
        }
        caret.classList.add("caret");
        this.display.appendChild(caret);
        return caret;
    }

    makeCharCard(char) {
        if (!char || char == " ") {
            char = "&nbsp;";
        }
        if (this.getAttribute("type") === "password") {
            char = `<svg fill="#ffffff" width="10" height="10" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <title>shield-solid</title>
            <path d="M31.25,7.4a43.79,43.79,0,0,1-6.62-2.35,45,45,0,0,1-6.08-3.21L18,1.5l-.54.35a45,45,0,0,1-6.08,3.21A43.79,43.79,0,0,1,4.75,7.4L4,7.59v8.34c0,13.39,13.53,18.4,13.66,18.45l.34.12.34-.12c.14,0,13.66-5.05,13.66-18.45V7.59Z" class="clr-i-solid clr-i-solid-path-1"></path>
            <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
            </svg>`
        }
        
        const card = document.createElement("span");
        card.classList.add("char-card");
        card.innerHTML = char;
        return card;
    }
    
    selectText(start, end) {
        this.selectedCards = [];
        const charCards = this.display.children;
        for (let position = 0; position < charCards.length; position++) {
            if (position >= start && position < end) {
                charCards[position].classList.add("selected");
                this.selectedCards.push(charCards[position]);
            } else {
                charCards[position].classList.remove("selected");
            }
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
