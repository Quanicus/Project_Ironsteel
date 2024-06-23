class GameConsole extends HTMLElement {
    constructor() {
        super()
        this.game = null;
    }
    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            this.game = new window.Game(this);
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