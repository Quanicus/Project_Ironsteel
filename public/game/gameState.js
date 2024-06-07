import resources from "./resources.js";
import { ArcherSprite } from "./Sprite.js";

class GameState {
    constructor() {
        this.otherHeros = [];
        this.terrrain = [];
        this.myHero = {};
        this.myHero.sprite =  new ArcherSprite("blue");
    }

    updateState(serverMsg) {
        this.otherHeros = serverMsg.otherHeros;
        Object.assign(this.myHero, serverMsg.myHero);
        this.otherHeros.forEach(hero => {
            //hero.spriteImg = resources.images.factions.red.archer;
            hero.sprite = new ArcherSprite("red");
        });
    }
}
const gameState = new GameState();
export default gameState;