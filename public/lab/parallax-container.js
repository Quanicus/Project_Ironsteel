class ParallaxContainer extends HTMLElement {
    constructor() {
        super()
        this.paraElements = [];
    }
    connectedCallback() {
        this.setScrollListener();
    }
    static getContentHeight(element) {
        
    }
    setScrollListener() {
        document.addEventListener('DOMContentLoaded', () => {
            this.paraElements = this.querySelectorAll('paralax-item');

            this.addEventListener('scroll', scrollEventHandler);
            //TODO add resize event listener -> re calibrate parallax-elements
        });
    }
    scrollEventHandler() {
        if (this.paraElements.length > 0) {
            this.paraElements.forEach((parallaxElement) => {
                if (parallaxElement.isIntersecting(this.scrollTop)) {
                    parallaxElement.render();
                }
            });
        }
    }
}
customElements.define('parallax-container', ParallaxContainer);