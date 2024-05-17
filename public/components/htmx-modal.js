class HTMXModal extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: grid;
                    place-items: center;
                    position: absolute;
                    top: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0,0,0,0.8);
                    z-index: 9999;
                    transform: translateY(-100%);
                    transition: transform 0.4s ease-in-out;
                    transition-delay: 1.8s;
                }
                :host([active]) {
                    transform: translateY(0);
                    transition-delay: 0s;
                } 

                .wrapper {
                    width: min(66vw, 1000px);
                    height: min(66vh, 800px);
                }

                .modal-container {
                    position: relative;
                    width: 0;
                    height: 0;
                    transition: all 0.6s ease-in-out;
                    transition-delay: 1.0s;

                    &[active] {
                        width: 100%;
                        height: 100%;
                        transition-delay: 0.6s;
                    }
                    &[active=preswap] {
                        width: 0;
                        height: 0;
                        transition-delay: 0s;
                    }
                    &[active=postswap] {
                        transition-delay: 0s;
                    } 
                    
                    .content-container {
                        box-sizing: border-box;
                        display: grid;
                        place-items: center;
                        height: 100%;
                        width: 100%;
                        overflow: hidden;
                        border: 1px solid white;
                        transform: translateX(-101%);
                        transition: transform 0.8s ease-in-out;

                        &[active] {
                            transform: translate(0);
                            transition-delay: 1.4s;
                        }
                    }

                    svg.corner {     
                        position: absolute;
                        fill: none;
                        stroke: white;
                        stroke-width: 0.6rem;
                        transition: all 0.4s ease-in-out;
                        transition-delay: 0.6s;
                        
                        &.left {
                            top: -2.5px;
                            left: -2.5px;

                            [active] & {
                                top: -2rem;
                                left: -2rem;
                            }
                            [active=preswap] & {
                                top: -2.5px;
                                left: -2.5px;
                            }
                        }

                        &.right {
                            bottom: -2.5px;
                            right: -2.5px;

                            [active] & {
                                bottom: -2rem;
                                right: -2rem;
                            }
                            [active=preswap] & {
                                bottom: -2.5px;
                                right: -2.5px;
                            }
                        } 
                    }

                    svg.border {
                        position: absolute;
                        width: calc(100% + 4rem);
                        height: calc(100% + 4rem);
                        inset: -2rem;  
    
                        line {
                            stroke: white;
                            stroke-width: 1px;
                            stroke-dasharray: 8 5;
                            stroke-dashoffset: 50%;
                            transition: transform 0.6s ease-in-out;
    
                            &.left {
                                transform: scale(1, 0);
                                transform-origin: top;
                                transition-delay: 0.6s;
    
                                [active] & {
                                    transition-delay: 1.0s;
                                    transform: scale(1);
                                }
                                
                            }
        
                            &.bottom {
                                transform: scale(0, 1);
                                transform-origin: right;
                                transition-delay: 0.4s;
    
                                [active] & {
                                    transition-delay: 1.2s;
                                    transform: scale(1);
                                }
                     
                            }
                        }
                    }
                }

                .content-wrap {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                

                .close-button {
                    position: absolute;
                    top: 50px;
                    right: 50px;
                    width: 50px;
                    height: 50px;
                    background-color: white;
                }
            </style>
            <div class="wrapper">
                <div class="modal-container" >
                    <svg class="corner left" width="50" height="50">
                        <path d="M0 0 H50"></path>
                        <path d="M0 0 V50"></path>
                    </svg>
                    <svg class="corner right" width="50" height="50">
                        <path d="M50 50 H-50"></path>
                        <path d="M50 50 V-50"></path>
                    </svg>
                    <svg class="border">
                        <line class="left" x1="0.15rem" y1="60px" x2="0.15rem" y2="calc(100% - 0.15rem)"></line>
                        <line class="bottom" x1="0.15rem" y1="calc(100% - 0.15rem)" x2="calc(100% - 60px)" y2="calc(100% - 0.15rem)"></line>
                    </svg>
                    <div class="content-wrap">
                        <div class="content-container" >
                            <slot></slot>
                        </div> 
                    </div>
                </div>
            </div>
            <div class="close-button"></div>

        `;
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.closeButton = this.shadowRoot.querySelector('.close-button');
        this.modalContainer = this.shadowRoot.querySelector('.modal-container');
        this.contentContainer = this.shadowRoot.querySelector('.content-container');
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            this.handleHTMXSwap();
            this.attachButtons();
        });
        this.setupCloseButton();
        eventBus.on("toggle-modal", () => {
            this.setAttribute('active', null);
            this.modalContainer.setAttribute('active', null);
            this.contentContainer.setAttribute('active', null);
        });
    }
    handleHTMXSwap() {
        this.addEventListener('htmx:beforeRequest', () => {
            this.modalContainer.setAttribute('active', 'preswap');

        });
        this.addEventListener('htmx:afterSwap', (event) => {
            const response = event.detail.xhr.response;
            if (response) {
                this.modalContainer.setAttribute('active', 'postswap');
            }
        })
        this.addEventListener("htmx:afterRequest", (event) => {
            const response = event.detail.xhr.response;
            if (response === "User successfully logged in.") {
                
                this.closeButton.dispatchEvent(new Event("click"));
                setTimeout(() => {
                    console.log("you made it in dog pop da boddles");
                    eventBus.emit("activate-app");
                }, 2300);
            }
            
        });
    }
    attachButtons() {
        const modalButtons = document.querySelectorAll('htmx-modal-button');
        modalButtons.forEach((button) => {
            button.setAttribute('hx-target', 'htmx-modal');
            button.setAttribute('hx-swap', 'innerHTML');
            button.setAttribute('hx-trigger', 'click');

            button.addEventListener('click', () => {
                //activate all relavent modal elements
                //this.setAttribute('active', null);
                this.modalContainer.setAttribute('active', null);
                this.contentContainer.setAttribute('active', null);
            });
        });
    }
    setupCloseButton() {
        this.closeButton.addEventListener('click', () => {
            this.removeAttribute('active');
            this.modalContainer.removeAttribute('active');
            this.contentContainer.removeAttribute('active');
        });
    }
}
customElements.define('htmx-modal', HTMXModal);
