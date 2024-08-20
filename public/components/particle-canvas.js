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
                }
                .division {
                    position: absolute;
                    width: 4px;
                    height: 100%;
                    top: 0;
                    left: max(26%, 300px);
                    cursor: ew-resize;
                    pointer-events: auto;
                    background: linear-gradient(to left, white, black);
                    nimation: division 1s infinite;

                    &::after,
                    &::before {
                        content: "";
                        position: absolute;
                        top: 0;
                        left:4px;
                        width: 10px;
                        height: 100%;
                        background: linear-gradient(to right, rgba(0,0,0,.5), transparent, transparent);
                    }
                    &::before {
                        left: -10px;
                        background: linear-gradient(to right, transparent, transparent, rgba(255,255,255,.5));
                    }
                }
                @keyframes division {
                    from {
                        top: 0;
                    }
                    to {
                        top: -100%;
                    }
                }
                
                .backdrop-canvas,
                .intermediate-canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background-color: maroon;
                    display: none;
                }
            </style>
            
            <div class="container">
                <canvas class="destination-canvas"></canvas>
            </div>
            <div class="division"></div>
            <canvas class="backdrop-canvas"></canvas>
            <canvas class="intermediate-canvas"></canvas>
        `;
        //background: radial-gradient(#ffc38c, #ff9b40);
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.destinationCanvas = this.shadowRoot.querySelector(".destination-canvas");
        this.backdropSourceCanvas = this.shadowRoot.querySelector(".backdrop-canvas");
        this.intermediateSourceCanvas = this.shadowRoot.querySelector(".intermediate-canvas");
        

        this.context = this.destinationCanvas.getContext('2d');
        this.container = this.shadowRoot.querySelector(".container");
        this.division = this.shadowRoot.querySelector(".division");
        this.backdropImg = null;
        this.intermediateImg = null;
        this.isDragging = false;
        this.mouse = { x: null, y: null, radius: (innerHeight/100) * (innerWidth/100) }
        this.particlesArray = null;
        this.intersectingElements = new Set();
        this.width = innerWidth;
        this.height = innerHeight;
        this.formatCanvas();
        window.addEventListener("resize", () => {
            this.width = innerWidth;
            this.height = innerHeight;
            this.formatCanvas();
            this.formatScene();
            this.mouse.radius = (innerHeight/100) * (innerWidth/100);
            this.initParticles();
        });
    }

    connectedCallback() {
        this.setScene();
        //this.formatScene();
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
        const canvasWidth = this.width;
        const canvasHeight = this.height;
        // keep particle within canvas
        if (particle.x > canvasWidth) {
            particle.x = canvasWidth;
            particle.velocity_x = -particle.velocity_x;
        }
        if (particle.x < 0) {
            particle.x = 0;
            particle.velocity_x = -particle.velocity_x;
        }
        if (particle.y > canvasHeight) {
            particle.y = canvasHeight;
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
            if (this.mouse.x < particle.x && particle.x < canvasWidth - particle.size * 10) {
                particle.x += 3;
                particle.velocity_x = -particle.velocity_x;
            }
            if (this.mouse.x > particle.x && particle.x > particle.size * 10) {
                particle.x -= 3;
                particle.velocity_x = -particle.velocity_x;
            }
            if (this.mouse.y < particle.y && particle.y < canvasHeight - particle.size * 10) {
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
        let numberOfParticles = (this.height * this.width / 9000);
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 5) + 1;
            //random position inside canvas
            let x = (Math.random() * (this.width - size * 4) + size * 2);
            let y = (Math.random() * (this.height - size * 4) + size * 2);
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
        ctx.clearRect(0, 0, this.width, this.height);
        const dx = parseInt(this.division.offsetLeft);

        if (this.backdropImg) {
            ctx.drawImage(this.backdropSourceCanvas, 0,0,dx,this.height, 0,0,dx,this.height);
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, dx, this.destinationCanvas.height);
        }
        
        for (let i = 0; i < this.particlesArray.length; i++) {
            this.updateParticle(this.particlesArray[i]);
        }
        this.connectDots();

        if (this.intermediateImg) {
            //console.log("darwing intermediate")
            ctx.drawImage(this.intermediateSourceCanvas, 
                dx,0,this.width-dx,this.height, 
                dx,0,this.width-dx,this.height);
        }
    }
    setScene() {
        const backdropUrl = this.getAttribute("backdrop-url");
        if (backdropUrl) {
            this.backdropImg = new Image();
            this.backdropImg.src = backdropUrl;
            this.backdropImg.onload = () => {
                this.formatScene();
            }
        }
        const intermediateUrl = this.getAttribute("intermediate-url");
        if (intermediateUrl) {
            this.intermediateImg= new Image();
            this.intermediateImg.src = intermediateUrl;
            this.intermediateImg.onload = () => {
                this.formatScene();
            }
        }
    }
    formatScene() {
        const scaleImg = (ctx, img) => {
            const imgAspectRatio = parseInt(img.naturalWidth)/parseInt(img.naturalHeight);
            const canvasAspectRatio = this.width/this.height;
            let sWidth, sHeight;

            // Determine scaling based on aspect ratio
            if (imgAspectRatio > canvasAspectRatio) {
                // Image is wider relative to the canvas
                sWidth = img.naturalHeight * canvasAspectRatio;
                sHeight = img.naturalHeight;
            } else {
                // Image is taller relative to the canvas
                sWidth = img.naturalWidth;
                sHeight = img.naturalWidth / canvasAspectRatio;
            }
            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0, sWidth, sHeight, 0, 0, this.width, this.height);
        }
        if (this.backdropImg) {
            const ctx = this.backdropSourceCanvas.getContext("2d");
            const img = this.backdropImg;
            scaleImg(ctx, img);
        }
        if (this.intermediateImg) {
            const ctx = this.intermediateSourceCanvas.getContext("2d");
            const img = this.intermediateImg;
            scaleImg(ctx, img);
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
                if (distance < (this.width/7) * (this.height/7)) {
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
            if (newPosition > this.width*0.04 && newPosition < this.width*0.96) {
                this.division.style.left = `${newPosition}px`;
            }
            
        });
    }
    formatCanvas = () => {
        this.destinationCanvas.width = this.width;
        this.destinationCanvas.height = this.height;
        this.backdropSourceCanvas.width = this.width;
        this.backdropSourceCanvas.height = this.height;
        this.intermediateSourceCanvas.width = this.width;
        this.intermediateSourceCanvas.height = this.height;
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