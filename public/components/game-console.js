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
        .form-container {
            position: absolute;
            display: none;
            background-color: black;
            place-items: center;
            inset: 0;
            width: 100%;
            height: 100%;

            &[active] {
                display: grid;
            }
        }
        #character-creation {
            display: flex;
            flex-direction: column;
            gap: 1em;
        }
    </style>
    <slot></slot>
    <div class="launch-screen">
        <div class="launch-button">Start Game</div>
    </div>
    <div class="form-container">
        <form id="character-creation">
            <p1>Create your character</p1>
            <shad-input-text id="character-name" name="characterName" placeholder="Character Name" required></shad-input-text>
            <shad-button>Create Character</shad-button>
        </form>
    </div>
`;
class GameConsole extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
        htmx.process(shadow);
        this.game = null;
        this.characterCreationForm = this.shadowRoot.querySelector("#character-creation");
        this.formContainer = this.shadowRoot.querySelector(".form-container");
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            //initiate game from <script> module
            this.game = new window.Game(this);
        })
        
        this.shadowRoot.querySelector(".launch-button")
        .addEventListener("click", async () => {
            try {
                const response = await fetch("game/v1/verify-character");
                if (response.ok) {//User logged in
                    this.shadowRoot.querySelector(".launch-screen").classList.add("launched");
                    if (response.status === 200) {
                        this.startGame();
                    } else {//Character not created yet
                        console.log("character not created");
                        this.formContainer.setAttribute("active","");
                    }
                } else {//User not logged in
                    console.log("You are not logged in.");
                    this.dispatchEvent(new CustomEvent("activateLogin")); 
                }
            } catch (error) {
                console.error("Error requesting character varification from server.");
            }
        });

        this.characterCreationForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(this.characterCreationForm);
            const urlEncodedData = new URLSearchParams();
            formData.forEach((value, key) => {
                urlEncodedData.append(key, value);
            });
            try {
                const response = await fetch('game/v1/make-character', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded', // Set the Content-Type
                    },
                    body: urlEncodedData.toString() 
                });
                if (response.status === 201) {
                    toast("Character successfully created");
                    this.formContainer.removeAttribute("active");
                    this.startGame();
                } else if (response.status === 409) {
                    toast("Failed to create character - name taken");
                    this.shadowRoot.querySelector("#character-name").setAttribute("placeholder", "Character Name - Already Taken");
                }
            } catch (error) {
                console.error("Error creating new character");
            }
        });
    }
    startGame() {
        this.game.openWebSocket();
    }
    endGame() {
        this.game.closeWebSocket();
    }
}
customElements.define("game-console", GameConsole);
