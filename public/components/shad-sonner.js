class ShadToastDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column-reverse;
                    gap: .5em;
                    position: fixed;
                    bottom: 40px;
                    right: 40px;
                    width: 350px;
                    height: 70px;
                    z-index: 1000;
                    perspective: 100px;
                    transition: all .25s;
                }
                :host(.hidden) {
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                    transform: translateY(100%);
                }
                :host(:hover) {
                    height: calc(210px + 1em);
                }
                :host(:hover) ::slotted(shad-toast) {
                    transition-duration: .4s;
                }
                :host(:hover) ::slotted([order="1"]) {
                    translate: 0 calc(-70px - .5em) 0;
                }
                :host(:hover) ::slotted([order="2"]) {
                    translate: 0 calc(-140px - 1.0em) 0;
                }
                :host(:hover) ::slotted([order="3"]) {
                    translate: 0 calc(-210px - 1.5em) 0;
                }
            </style>
            <slot></slot>
        `;
        this.timeoutId = null;
        this.addEventListener("mouseenter", () => {
            this.show();
        });
        this.addEventListener("mouseleave", () => {
            this.hide();
        });
    }
    show() {
        clearTimeout(this.timeoutId);
        this.classList.remove("hidden");
        this.removeAttribute("collapse");
    }
    hide() {
        this.setAttribute("collapse", "");
        this.timeoutId = setTimeout(() => {
            if (this.hasAttribute("collapse")) {
                this.classList.add("hidden");
            }
        }, 2000);
    }
    assignOrder() {
        const children = this.children;
        for (let i = 0; i < 4; i++) {
            children[i].setAttribute("order", i);
            void children[i].offsetHeight;//force repaint on safari
        }
    }
}
customElements.define("shad-toast-display", ShadToastDisplay);

class ShadToast extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    font-size: 10px;
                    position: absolute;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;
                    gap; 2em;
                    width: 350px;
                    height: 70px;
                    border: 1px solid #303030;
                    border-radius: 5px;
                    background-color: black;
                    padding: 0 2em;
                    transition: all .25s;
                }
                :host(.new) {
                    opacity: 0;
                    transform: translateY(50px);
                }
                :host(:first-child[remove]) {
                    transform: translateY(100%);
                }
                .content {
                    font-size: 12px;
                }
                .date {
                    color: #B4B4B4;
                }
                .close-button {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    border-radius: 5px;
                    padding: .6em;
                    color: black;
                    background-color: white;
                    cursor: pointer;

                    &:active {
                        background-color: black;
                        border: 1px solid white;
                        color: white;
                    }
                }
                :host([order="0"]) {
                    z-index: 3;
                }
                :host([order="1"]) {
                    z-index: 2;
                    translate: 0 -20px -10px;
                }
                :host([order="2"]) {
                    z-index: 1;
                    translate: 0 -40px -20px;
                }
                :host([order="3"]) {
                    z-index: 0;
                    translate: 0 -60px -30px;
                    opacity: 0;
                }
            </style>
            <div class="content">content</div>
            <div class="date">date</div>
            <div class="close-button">Close</div>
        `;
        this.shadowRoot.querySelector(".close-button").addEventListener("click", () => {
            this.setAttribute("remove", "");
            this.style.zIndex = "-1";
            this.style.opacity = "0";
            const children = Array.from(this.parentElement.children);
            const index = children.indexOf(this);
            for (let i = index; i < 4 && i < children.length; i++) {
                const newOrder = parseInt(children[i].getAttribute("order") - 1);
                children[i].setAttribute("order", newOrder);
            } 
        });
        this.addEventListener("transitionend", () => {
            if (this.hasAttribute("remove")) {
                this.remove();
            }
        });

        const now = new Date('2025-03-22T22:16:38-05:00'); // Your example date
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const weekday = weekdays[now.getDay()];
        const month = months[now.getMonth()];
        const day = String(now.getDate()).padStart(2, '0');
        const year = now.getFullYear();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;

        const formattedDate = `${weekday}, ${month} ${day}, ${year} at ${hour12}:${minutes} ${period}`;

        this.shadowRoot.querySelector(".date").textContent = formattedDate;
    }
    connectedCallback() {
        this.shadowRoot.querySelector(".content").textContent = this.getAttribute("event");
    }
}
customElements.define("shad-toast", ShadToast);

{
const display = document.createElement("shad-toast-display");
display.classList.add("hidden");
document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(display);
});

class Sonner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML =`
            <style>
                :host {
                    display: inline-block;
                    padding: .6em;
                    border: 1px solid #303030;
                    border-radius: 5px;
                    background-color: black;
                    cursor: pointer;
                }
                :host(:hover) {
                    background: #303030;
                }
                :host(:active) {
                    background: black;
                    border-color: white;
                }
                @keyframes slideIn {
                
                }
            </style>
            <span class="label"></span>
        `;
        this.label = this.shadowRoot.querySelector(".label");
    }
    connectedCallback() {
        this.label.textContent = this.getAttribute("data-label");
        this.addEventListener("click", () => {
            const toast = document.createElement("shad-toast");
            toast.setAttribute("event", this.textContent.trim());
            toast.classList.add("new");
            display.show();
            display.prepend(toast);
            requestAnimationFrame(() => {
                toast.classList.remove("new");
            });
            display.assignOrder();
            display.hide();
        });
    }
}
customElements.define("shad-sonner", Sonner);
}
