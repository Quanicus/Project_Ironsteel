import resources from "./resources.js";
import { ArcherSprite } from "./Sprite.js";

class GameState {
    constructor() {
        this.terrrain = [];
        this.myHero = {};
        this.herosOnline = new Map();
        this.myHero.sprite =  new ArcherSprite("blue");
    }

    updateState(serverMsg) {
        const herosUpdate = serverMsg.playersOnline;
        const onlineIds = [];
        herosUpdate.forEach(hero => {
            const id = hero.id;
            onlineIds.push(id);
            if (this.herosOnline.has(id)) {
                // If hero exists in herosOnline map, update its properties
                Object.assign(this.herosOnline.get(id), hero);
            } else {
                // If hero does not exist in herosOnline map
                if (serverMsg.myHero.id === id) {
                    // If hero is the player's own hero
                    Object.assign(this.myHero, hero);
                    this.herosOnline.set(id, this.myHero);
                } else {
                    // If hero is not the player's own hero
                    hero.sprite = new ArcherSprite("red"); // Assuming "red" is the color for archer sprite
                    this.herosOnline.set(id, hero);
                }
            }
        });
        for (const id of this.herosOnline.keys()) {
            if (!onlineIds.includes(id)) {
                this.herosOnline.delete(id);
            }
        }
    }
}
const gameState = new GameState();
export default gameState;