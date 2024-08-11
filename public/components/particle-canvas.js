class ParticleCanvas extends HTMLElement {
    constructor() {
        super();
        
        const template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    top: 0;
                    width: 100vw;
                    height: 100vh;
                    pointer-events: none;

                    background-size: cover; /* Cover the entire background */
                    background-repeat: no-repeat; /* Do not repeat the background */
                    background-position: center; /* Center the background image */
                }
                div.slider:hover {
                    bottom: 0 !important;
                }
                .container {
                    position: relative;
                    height: 100vh;
                    
                    transform: translateZ(-50px) scale(1.5);
                }
                .division {
                    position: absolute;
                    width: 0px;
                    height: 100%;
                    top: 0;
                    left: calc(50%);
                    border-left: 2px solid white;
                    border-right: 2px solid black;
                    cursor: ew-resize;
                    pointer-events: auto;
                }
                
                canvas {
                    
                }
            </style>
            <div class="container">
                <canvas></canvas>
            </div>
            <div class="division"></div>

        `;
        //background: radial-gradient(#ffc38c, #ff9b40);
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.canvas = this.shadowRoot.querySelector("canvas");
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.context = this.canvas.getContext('2d');
        this.container = this.shadowRoot.querySelector(".container");
        this.division = this.shadowRoot.querySelector(".division");
        this.isDragging = false;
        this.mouse = { x: null, y: null, radius: (this.canvas.height/100) * (this.canvas.width/100) }
        this.particlesArray = null;
        this.intersectingElements = new Set();
        this.backdrop = null;

        window.addEventListener("resize", () => {
            this.canvas.width = innerWidth;
            this.canvas.height = innerHeight;
            this.mouse.radius = (innerHeight/100) * (innerWidth/100);
            this.initParticles();
            if (this.backdrop) {
                this.backdrop.width = innerWidth;
                this.backdrop.height = innerHeight;
            }
        });
    }

    connectedCallback() {
        this.setBackdrop();
        this.trackMouse();
        this.activateSlider();
        this.initParticles();
        this.animate();
    }

    disconnectedCallback() {
        console.log('Custom canvas element removed from the page.');
    }

    // check particle position, check mouse postion, move particle, draw particle
    updateParticle(particle) {
        // keep particle within canvas
        if (particle.x > innerWidth) {
            particle.x = innerWidth;
            particle.velocity_x = -particle.velocity_x;
        }
        if (particle.x < 0) {
            particle.x = 0;
            particle.velocity_x = -particle.velocity_x;
        }
        if (particle.y > innerHeight) {
            particle.y = innerHeight;
            particle.velocity_y = -particle.velocity_y;
        }
        if (particle.y < 0) {
            particle.y = 0;
            particle.velocity_y = -particle.velocity_y;
        }
        //calculate distance between particle and cursor
        let dx = this.mouse.x - particle.x;
        let dy = this.mouse.y - particle.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        //check for collision with mouse
        if (distance < this.mouse.radius + particle.size) {
            //check which direction to push particles
            if (this.mouse.x < particle.x && particle.x < innerWidth - particle.size * 10) {
                particle.x += 3;
                particle.velocity_x = -particle.velocity_x;
            }
            if (this.mouse.x > particle.x && particle.x > particle.size * 10) {
                particle.x -= 3;
                particle.velocity_x = -particle.velocity_x;
            }
            if (this.mouse.y < particle.y && particle.y < innerHeight - particle.size * 10) {
                particle.y += 3;
                particle.velocity_y = -particle.velocity_y;
            }
            if (this.mouse.y > particle.y && particle.y > particle.size * 10) {
                particle.y -= 3;
                particle.velocity_y = -particle.velocity_y;
            }
        }
        //check for collision with intersecting elements
        this.intersectingElements.forEach(element => {
            const elementRect = element.getBoundingClientRect();

            if (particle.x > elementRect.left && particle.x < elementRect.right 
                && particle.y > elementRect.top && particle.y < elementRect.bottom) {

                const deltaTop = particle.y - elementRect.top;
                const deltaBottom = elementRect.bottom - particle.y;
                const deltaLeft = particle.x - elementRect.left;
                const deltaRight = elementRect.right - particle.x;

                const minDistance = Math.min(deltaTop, deltaRight, deltaBottom, deltaLeft);
                switch(minDistance) {
                    case deltaTop:
                        particle.y = elementRect.top;
                        if (particle.velocity_y > 0) {//moving down
                            particle.velocity_y = -particle.velocity_y;
                        }
                        break;
                    case deltaBottom:
                        particle.y = elementRect.bottom;
                        if (particle.velocity_y < 0) {//moving up
                            particle.velocity_y = -particle.velocity_y
                        }
                        break;
                    case deltaLeft:
                        particle.x = elementRect.left;
                        if (particle.velocity_x > 0) {//moving right
                            particle.velocity_x = -particle.velocity_x;
                        }
                        break;
                    case deltaRight:
                        particle.x = elementRect.right;
                        if (particle.velocity_x < 0) {//moving left
                            particle.velocity_x = -particle.velocity_x;
                        }
                        break;   
                }
            } 
        });

        particle.x += particle.velocity_x;
        particle.y += particle.velocity_y;

       this.drawParticle(particle);
    }
    initParticles() {
        const particlesArray = [];
        let numberOfParticles = (innerHeight * innerWidth / 9000);
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 5) + 1;
            //random position inside canvas
            let x = (Math.random() * (innerWidth - size * 4) + size * 2);
            let y = (Math.random() * (innerHeight - size * 4) + size * 2);
            //random velocity between -2.5 and 2.5
            let velocity_x = (Math.random() * 3) - 1.5;
            let velocity_y = (Math.random() * 3) - 1.5;

            particlesArray.push(new Particle(x, y, velocity_x, velocity_y, size));
        }
        this.particlesArray = particlesArray;
    }
    drawParticle(particle) {
        const ctx = this.context;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, false);
        //ctx.fillStyle = particle.color;
        ctx.fillStyle = "red";
        if(particle.x > parseInt(this.division.offsetLeft)) {
            //particle is to the right side of the division
            ctx.fillStyle = "black";
        } else {
            ctx.fillStyle = "white";
        }
        ctx.fill();
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const ctx = this.context;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        const dx = parseInt(this.division.offsetLeft);
        if (this.backdrop) {
            ctx.drawImage(this.backdrop, 0,0,dx,innerHeight, 0,0,dx,innerHeight);
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, dx, this.canvas.height);
        }
        
        for (let i = 0; i < this.particlesArray.length; i++) {
            this.updateParticle(this.particlesArray[i]);
        }
        this.connectDots();
    }
    setBackdrop() {
        const backgroundUrl = this.getAttribute("background-url");
        const backdropUrl = this.getAttribute("backdrop-url");
        if (backdropUrl) {
            const backdrop = new Image();
            backdrop.src = backdropUrl;
            backdrop.width = innerWidth;
            backdrop.height = innerHeight;
            backdrop.style.objectFit = "cover";
            // backdrop.style.position = "absolute";
            // backdrop.style.top = "0";
            // backdrop.style.left = "0";
            // backdrop.style.zIndex = "100";
            // this.shadowRoot.appendChild(backdrop);
            this.backdrop = backdrop;
        }
    }
    connectDots() {
        let opacity = 1;
        const pArr = this.particlesArray;
        const ctx = this.context;
        for (let i = 0; i < pArr.length; i++) {
            for (let j = i; j < pArr.length; j++) {
                let dx = pArr[i].x - pArr[j].x;
                let dy = pArr[i].y - pArr[j].y;
                let distance = (dx*dx + dy*dy);
                const divisionPosition = parseInt(this.division.offsetLeft);
                if (distance < (innerWidth/7) * (innerHeight/7)) {
                    opacity = 1 - (distance/20000);
                    if (pArr[i].x > divisionPosition && pArr[j].x > divisionPosition) {
                        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
                    } else if (pArr[i].x < divisionPosition && pArr[j].x < divisionPosition) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    } else {
                        ctx.strokeStyle = `rgba(128, 128, 128, ${opacity})`;
                    }
                    
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(pArr[i].x, pArr[i].y);
                    ctx.lineTo(pArr[j].x, pArr[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    trackMouse() {
        document.body.addEventListener("mousemove", (event) => {
            this.mouse.x = event.x;
            this.mouse.y = event.y;
        });
        document.body.addEventListener("mouseout", () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    activateSlider() {
        this.shadowRoot.querySelector(".division")
        .addEventListener("mousedown", () => {
            this.isDragging = true;
            document.body.style.cursor = "ew-resize";
            document.body.style.userSelect = "none";
        });
        document.addEventListener("mouseup", () => {
            this.isDragging = false;
            document.body.style.cursor = "auto";
            document.body.style.userSelect = "auto";
        });
        document.body.addEventListener("mouseleave", () => {
            this.isDragging = false;
            document.body.style.cursor = "auto";
            document.body.style.userSelect = "auto";
        });

        document.addEventListener("mousemove", (event) => {
            if (!this.isDragging) {
                return;
            }
            const newPosition = event.clientX;
            if (newPosition > innerWidth*0.04 && newPosition < innerWidth*0.96) {
                this.division.style.left = `${newPosition}px`;
            }
            
        });
    }
}

// Define the custom element.
customElements.define('particle-canvas', ParticleCanvas);

class Particle {
    constructor(x, y, velocity_x, velocity_y, size) {
        this.x = x;
        this.y = y;
        this.velocity_x = velocity_x;
        this.velocity_y = velocity_y;
        this.size = size;
    }
}