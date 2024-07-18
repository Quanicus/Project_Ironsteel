const template = document.createElement("template");
template.innerHTML = `
    <style>
        * {
            box-sizing: border-box;
            scrollbar-width: none;
        }
        :host {
            position: relative;
            display: block;
            font-size: 1rem;
            cursor: text;
        }
        :host(:focus) {
            & .placeholder::after {
                font-size: 0.65rem;
                top: -0.65em;
                color: white;
                padding-inline: 0.3em;
                transition-duration: 0.15s;
            }
            & .text-display {
                border-color: white;
                
            }
            & span{
                &.caret::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    width: 1px;
                    height: 100%;
                    background-color: gold;
                    animation: blink 1s step-end infinite;
                }
                &.selected {
                    background-color: gold;
                    color: black;
                }
            }
            & input {
                z-index: 2;
            }
        }
        :host(:hover) {
            & .placeholder::after {
                
            }
            & .text-display {
                border-color: white;
            }
        }
        :host([type]) {
            width: 150px;
        }
        :host([type="password"]) {
            & input {
                letter-spacing: 0.3rem;
            }
        }
        .placeholder {
            --placeholder: "default";
            position: relative;
            padding: .5rem;
            height: 100%;
            width: fit-content;

            &::after {
                content: var(--placeholder);
                position: absolute;
                font-size: 0.65rem;
                top: -0.65em;
                left: 1em;
                color: gold;
                background-color: black;
                padding-inline: 0.3em;
                transition-property: top, font-size;
                transition-duration: 0.15s;
                transition-timing-function: ease-in;
            }     
        }
        .placeholder.empty {
            &::after {
                top: 0.5rem;
                border-radius: 50%;
                transition-duration: 0.25s;
                font-size: 1rem;
                color: white;
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
            background-color: black;
            overflow-x: scroll;

            & span {
                position: relative;
                animation: drop-in .35s forwards;
                flex-shrink: 0;
            }
        }
        @keyframes drop-in {
            0%, 35% {
                transform: translateY(0);
                opacity: 1;
                color: gold;
                
            }
            100% {
                transform: translateY(0);
                opacity: 1;
                color: white;
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
    <div class="placeholder">
        <input spellcheck="false"/>
        <div class="text-display"></div>
    </div>
    
    
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

        this.placeholder = this.shadowRoot.querySelector(".placeholder");
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
        this.placeholder.classList.add("empty");
        this.placeholder.style.setProperty("--placeholder", `"${this.getAttribute("type")}"`);
        console.log("placeholding: ", this.placeholder);
        this.tabIndex = this.getAttribute("tabindex") ?? "-1";
        this._proxyInput();
        this.attachListeners();
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
        
    }
    handleBeforeInput = (event) => {
        const display = this.display;
        const input = this.input;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const selectedText = input.value.substring(start, end);

        console.log("indicies before input: ", start, end);
        //console.log(event.inputType);
        if (selectedText) {//remove highlighted text
            this.selectedCards.forEach(card => this.display.removeChild(card));
            this.caretElement = this.display.children[start];
        }
        switch (event.inputType){
            case "insertText":
                const char = event.data;
                //add inserted text into container starting at start
                display.insertBefore(this.makeCharCard(char),this.caretElement);
                
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
                [...event.data].forEach(char => {
                    display.insertBefore(this.makeCharCard(char),this.caretElement);
                });
                break;
        }
    }
    handleAfterInput = (event) => {
        const placeholder = this.shadowRoot.querySelector(".placeholder");
        const input = this.input;
        if (input.value.length !== this.display.childElementCount - 1) {
            this.display.replaceChildren(...this.syncInput());
        }
        //console.log(input.value);
        // if (this.getAttribute("type") === "email" && input.value && !input.validity.valid) {
        //     input.setCustomValidity("Please enter a valid Email address.");
        // } else {
        //     input.setCustomValidity("");
        // }
        this._internals.setFormValue(input.value);
        this._internals.setValidity(input.validity, input.validationMessage);

        if (input.value.length === 0) {
            placeholder.classList.add("empty");
        } else {
            console.log("removing empty");
            console.log(placeholder.classList);
            placeholder.classList.remove("empty");
        }
        
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
