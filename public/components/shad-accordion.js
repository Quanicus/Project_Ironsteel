class ShadAccordion extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
        <style></style>
        <div class="panel">
            <svg xmlns="http://www.w3.org/2000/svg" class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            this.panel.prepend(panel.textContent);
        });
    }
}
customElements.define("shad-accordion", ShadAccordion);
