const template =  document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            position: relative;
            overflow: hidden;
        }
        .launch-screen {
            position: absolute;
            display: grid;
            place-content: center;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: purple;

            &.launched {
                display: none;
            }
        }
        .launch-button {
            padding: 1em;
            background-color: red;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
    <slot></slot>
    <div class="launch-screen">
        <div class="launch-button">Start Game</div>
    </div>
`;
class GameConsole extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: "open"})
        .appendChild(template.content.cloneNode(true));
        this.game = null;
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            //initiate game from <script> module
            this.game = new window.Game(this);
        })
        this.shadowRoot.querySelector(".launch-button")
        .addEventListener("click", () => {
            this.startGame();
            this.shadowRoot.querySelector(".launch-screen")
            .classList.add("launched");
        })
    }
    startGame() {
        this.game.openWebSocket();
    }
    endGame() {
        this.game.closeWebSocket();
    }
}
customElements.define("game-console", GameConsole);