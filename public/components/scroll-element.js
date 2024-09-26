const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    transition: all 0.4s ease-in-out;
                }
                :host(intersecting) {
                    translate: 200px;
                }
                :host(.diverging) {
                    opacity: 0;
                    translate: 0 1em;
                }
            </style>
            <slot></slot>
        `;
class ScrollElement extends HTMLElement {
    constructor() {
        super();
        
        this.attachShadow({mode: 'open'})
        .appendChild(template.content.cloneNode(true));
        this.scrollContainer = null;
    }
    connectedCallback() {
        this.setScrollContainer();
        this.observeElement();
        //this.style.setProperty('transform', 'translateX(50%)');
        document.body.addEventListener("scroll", () => console.log(document.body.scrollTop));
    }
    setScrollContainer() {
        let containerCandidate = this.parentElement;
        while (containerCandidate) {
            if (containerCandidate === document.body || 
                containerCandidate.scrollHeight > containerCandidate.clientHeight) {
                this.scrollContainer = containerCandidate;
                break;
            }
            containerCandidate = containerCandidate.parentElement;
        }
        
    }
    observeElement() {
        //console.log(this.scrollContainer);
        const config = {
            //root: specifies element to use as viewport
            root: this.scrollContainer,
            //rootMargin: '-40% 0px -40% 0px',
            rootMargin: '0px 0px -8% 0px',
            threshold: 0
        }
        const observer = new IntersectionObserver(this.handleIntersection, config);
        observer.observe(this);
    }
    handleIntersection = (entries, observer) => {

        entries.forEach((element) => {
            if (element.isIntersecting) {
                this.classList.add("intersecting");
                this.classList.remove("diverging");
            } else {
                this.classList.remove("intersecting");
                this.classList.add("diverging");
            }
        });
    }
}
customElements.define('scroll-element', ScrollElement);