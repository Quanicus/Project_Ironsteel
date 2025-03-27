const template =  document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            position: relative;
        }
        .launch-screen {
            position: absolute;
            display: grid;
            place-content: center;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            border: 1px solid #303030;
            border-radius: 9px;
            overflow: hidden;

            &.launched {
                display: none;
            }
        }
        .launch-button {
            padding: 1em;
            background-color: black;
            border: 1px solid #303030;
            border-radius: 5px;
            cursor: pointer;

            &:hover {
                background-color: #303030;
            }
            &:active {
                border-color: white;
                background-color: black;
            }
        }
        [status="close"] {
            visibility: hidden;
            opacity: 0;
            pointer-events: none;
        }
        [status="open"] {
            visibility: visible;
            opacity: 1;
        }
        .modal-overlay {
            position: fixed;
            display: grid;
            place-items: center;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0,0,0,0.6);
            transition: all 0.6s ease-in-out;
        }
        .modal-container {
            position: relative;
            width: 30%;
            height: 30%;
        }
        .modal-content {
            position: absolute;
            display: grid;
            place-items: center;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            border: 1px solid #303030;
            border-radius: 9px;

            &[status="open"] {
                animation: slideIn 0.3s ease-in-out forwards;
            }
            &[status="close"] {
                animation: slideOut 0.3s ease-in-out forwards;
            }        
        }
        form {
            display: grid;
            place-items: center;
            gap: 0.5em;
        }
        shad-input-text {
            border-radius: 5px;
       
            &[valid="true"] {
                border: 1px solid green;
            } 
            &[valid="false"] {
                border: 1px solid red;
            }
        }
        @keyframes slideIn {
            from {
                visibility: hidden; 
                opacity: 0;
                transform: translateY(50%);
            }
            to {
                visibility: visible;
                opacity: 1;
                transform: translateY(0)
            }
        }
        @keyframes slideOut {
            from {
                visibility: visible; 
                opacity: 1;
                transform: translateY(0);
            }
            to {
                visibility: hidden;
                opacity: 0;
                transform: translateY(-50%);
            }
        }
    </style>

    <slot></slot>

    <div class="launch-screen">
        <div class="launch-button">Start Game</div>
    </div>

    <section class="modal-overlay" status="close">

        <div class="modal-container">
            <div class="modal-content login" status="close">
                <form action="api/v1/users/login" method="post" id="login-form">
                    <p>Login</p>
                    <shad-input-text type="email" id="email" name="email" placeholder="Email" required="true"></shad-input-text>
                    <shad-input-text type="password" id="password" name="password" placeholder="Password" required="true"></shad-input-text>
                    <span>
                        <shad-button type="submit" id="submit-login-form">Submit</shad-button>
                        <shad-button type="button" class="register-button">register</shad-button>
                    </span>
                </form>
            </div>

            <div class="modal-content register" status="close">
                <form action="api/v1/users/register" method="post" id="register-form">
                    <p>Register</p>
                    <shad-input-text id="name" name="name" placeholder="Name"></shad-input-text>
                    <shad-input-text 
                        hx-post="/api/v1/users/checkEmail" 
                        hx-trigger="validateEmail" 
                        hx-swap="outerHTML swap:0s"
                        type="email" id="register-email" name="email" placeholder="Email" required>
                    </shad-input-text>
                    <shad-input-text type="password" id="register-password" name="password" placeholder="Password"></shad-input-text>
                    <shad-input-text type="password" id="password-confirm" name="passwordConfirm" placeholder="Retype password"></shad-input-text>
                    <span>
                        <shad-button type="submit" id="submit-register-form" disabled>Submit</shad-button>
                        <shad-button type="button" class="login-button">log in</shad-button>
                    </span>
                </form>
            </div>
        </div>

    </section>
`;
class GameConsole extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
        htmx.process(shadow);

        this.modalOverlay = shadow.querySelector(".modal-overlay");
        this.loginModal = shadow.querySelector(".modal-content.login");
        this.registerModal = shadow.querySelector(".modal-content.register");
        this.loginButton = shadow.querySelector(".login-button");
        this.registerButton = shadow.querySelector(".register-button");
        
        this.modalOverlay.addEventListener("click", (event) => {
            if (event.target === event.currentTarget) {
                this.closeModal();
            }
        });

        this.loginButton.addEventListener("click", () => {
            this.loginModal.setAttribute("status", "open");
            this.registerModal.setAttribute("status", "close");
        });

        this.registerButton.addEventListener("click", () => {
            this.loginModal.setAttribute("status", "close");
            this.registerModal.setAttribute("status", "open");
        });

        shadow.querySelector("#register-form").addEventListener("submit", async (event) => {
            event.preventDefault();

            const form = event.target;
            const formData =new URLSearchParams(new FormData(form));

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formData,
                });

                if (!response.ok) {
                    
                } else {
                    this.registerModal.setAttribute("status", "close");
                    this.loginModal.setAttribute("status", "open");
                    this.loginModal.querySelector("p").textContent = "Successfully registered. Please log in.";
                    form.querySelector("#register-email").setAttribute("placeholder", "Email");
                    form.querySelector("#register-email").default = "";
                    form.reset();
                }
            } catch (error) {
                console.error("Error register in:", error);
            }
        });

        shadow.querySelector("#login-form").addEventListener("submit", async (event) => {
            event.preventDefault();
    
            const form = event.target;
            const formData =new URLSearchParams(new FormData(form));

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formData,
                });
                form.reset();
                if (!response.ok) {
                    this.loginModal.querySelector("p").textContent = "Login failed try again.";
                } else {
                    this.closeModal();
                    this.startGame();
                    this.shadowRoot.querySelector(".launch-screen").classList.add("launched");
                }
            } catch (error) {
                console.error("Error logging in:", error);
            }
        });

        this.enableRegisterValidation();

        this.game = null;
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            //initiate game from <script> module
            this.game = new window.Game(this);
        })
        this.shadowRoot.querySelector(".launch-button")
        .addEventListener("click", () => {
            fetch("api/v1/users/status")
                .then(response => {
                    if (response.ok) {
                        console.log("you are logged in");  
                                
                    this.startGame();
                    this.shadowRoot.querySelector(".launch-screen")
                    .classList.add("launched");
                    } else if (response.status >= 400 && response.status < 500) {
                        console.log("please log in");
                        this.modalOverlay.setAttribute("status", "open");
                        this.loginModal.setAttribute("status", "open");
                    } else {
                        throw new Error(`Unexpected status: ${response.status}`);
                    }
                })
                .catch(error => {
                    console.error("Error logging into game", error.message)
                });

        })
    }
    startGame() {
        this.game.openWebSocket();
    }
    endGame() {
        this.game.closeWebSocket();
    }
    
    closeModal() {
        this.modalOverlay.setAttribute("status", "close");
        this.loginModal.setAttribute("status", "close");
        this.registerModal.setAttribute("status", "close");
        this.loginModal.querySelector("p").textContent = "Log in"
    }

    enableRegisterValidation() {
        const shadow = this.shadowRoot;
        const name = this.shadowRoot.getElementById("name");
        let email = this.shadowRoot.getElementById("register-email");
        const password = this.shadowRoot.getElementById("register-password");
        const passwordConfirm = this.shadowRoot.getElementById("password-confirm");
        const submitButton = this.shadowRoot.getElementById("submit-register-form");

        const nameRegex = /^[a-zA-Z0-9]{3,}$/;
        name.addEventListener("change", () => {
            name.value = name.value.trim();
            if (nameRegex.test(name.value)) {
                name.setAttribute("valid", "true");
                console.log("name valid");
                //trigger submit button
            } else {
                name.setAttribute("valid", "false");
                submitButton.setAttribute("disabled", true);
                console.log("name invalid");
                //display error msg
            }
            submitButton.dispatchEvent(new Event("enable"));
        });

        function addEmailListener() {
            email = shadow.getElementById("register-email");
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            email.addEventListener("change", (event) => {
                email.value = email.value.trim();
                if (emailRegex.test(email.value)) {
                    email.dispatchEvent(new Event("validateEmail"));
                    //email.setAttribute("valid", "true");
                } else {
                    email.setAttribute("placeholder", "Email");
                    email.setAttribute("valid", "false");
                    //display error: pls enter a valid email
                }
                submitButton.dispatchEvent(new Event("enable"));
            });
        };
        addEmailListener();

        const passwordRegex = /[\s\x00-\x1F\x7F"'/<>%&|]/g;
        password.addEventListener("change", () => {
            if (password.value.length < 8) {
                password.setAttribute("valid", "false");
                //display error: password must contain at least 8 valid characters.
            } else {
                const illegalChars = password.value.match(passwordRegex);
                if (illegalChars === null) {
                    password.setAttribute("valid", "true");
                    //trigger to submitButton to check if still disabled
                    console.log(password.value);
                } else {
                    password.setAttribute("valid", "false");
                    const bannedCharsSet = new Set(illegalChars);
                    const bannedCharsArray = Array.from(bannedCharsSet);

                    //display error: pw cannot contain the characters: illegalChars
                    console.log(bannedCharsArray);
                }
            }
            //trigger passwordConfirm to check if its same now( or empty?)
            passwordConfirm.dispatchEvent(new Event("change"));
            submitButton.dispatchEvent(new Event("enable"));
        });

        passwordConfirm.addEventListener("change", () => {
            if (passwordConfirm.value === password.value) {
                passwordConfirm.setAttribute("valid", "true");
            } else {
                passwordConfirm.setAttribute("valid", "false");
            }
            submitButton.dispatchEvent(new Event("enable"));
        });

        submitButton.addEventListener("enable", () => {
            console.log("enabling");
            for (const input of [name, email, password, passwordConfirm]) {
                console.log(input.getAttribute("valid"));
                if (input.getAttribute("valid") !== "true") {
                    console.log("failed", input);
                    submitButton.setAttribute("disabled", "true");
                    return;
                }
            }
            console.log("enabled");
            submitButton.removeAttribute("disabled");
            console.log(submitButton);
        });

        const form = this.shadowRoot.getElementById("register-form");
        form.addEventListener("htmx:afterSwap", () => {
            addEmailListener();
            submitButton.dispatchEvent(new Event("enable"));
        });
        
    }
}
customElements.define("game-console", GameConsole);
