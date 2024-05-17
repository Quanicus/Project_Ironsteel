class ParallaxElement extends HTMLElement {
    constructor() {
        super();
        this.anchorTop = 0;
        this.anchorBottom = 0;
        this.speed = 0;
        this.parallaxContainer = this.setParallaxContainer();
    }
    connectedCallback() {
        this.setSpeed();
        this.setAnchors();
    }
    render() {
        //translateX amount = (container.scrollTop - anchorTop) * speed)
        const translateDistance = (this.parallaxContainer.scrollTop - this.anchorTop) * this.speed;
        this.style.setProperty('transform', `translateX(${translateDistance}px)`);
    }
    //this iterates up the parent chain looking for the <parallax-container> tag
    setParallaxContainer() {
        const containerCandidate = this.parentElement;
        while (containerCandidate) {
            if (containerCandidate.localName === 'parallax-container') {
                this.parallaxContainer = containerCandidate;
                return containerCandidate;
            }
            containerCandidate = containerCandidate.parentElement;
        }
        throw new Error('No <parallax-container> found.');
    }
    //set the speed defined by the markup or sets it to a default 0.5
    setSpeed() {
        this.speed = parseFloat(this.getAttribute('data-speed')) || 0.5;
    }
    //sets the 2 reference points used to determine if the element is 'intersecting' the container.
    setAnchors() {
        const container = this.parallaxContainer;
        const containerRect = container.getBoundingClientRect();
        const elementRect = this.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        //this represents the distance in pixel from the top of the scrollable content to the top of the parallax element. we find the distance from the top of the element to the top of the container and add the distance currently scrolled by the container.
        const relativePositionTop = elementRect.top - containerRect.top + scrollTop;

        this.anchorTop = relativePositionTop - container.clientHeight;
        this.anchorBottom = this.anchorTop + (container.clientHeight / this.speed);
    }
    isIntersecting(scrollTop) {
        return scrollTop >= this.anchorTop
            && scrollTop <= this.anchorBottom;
        
    }
}
customElements.define('parallax-element', ParallaxElement);