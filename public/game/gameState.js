import resources from "./resources.js";
import { ArcherSprite, GoblinSprite } from "./Sprite.js";

class GameState {
    constructor() {
        this.terrrain = [];
        this.myHero = {};
        this.heroesOnline = new Map();
        this.goblins = new Map();
        this.myHero.sprite =  new ArcherSprite("blue");
        this.projectiles = [];
    }

    updateState(serverMsg) {
        const heroesUpdate = serverMsg.playersOnline;
        const onlineHeroIds = [];
        heroesUpdate.forEach(hero => {
            const id = hero.id;
            onlineHeroIds.push(id);
            if (this.heroesOnline.has(id)) {
                // If hero exists in herosOnline map, update its properties
                Object.assign(this.heroesOnline.get(id), hero);
            } else {
                // If hero does not exist in herosOnline map
                if (serverMsg.myHero.id === id) {
                    // If hero is the player's own hero
                    Object.assign(this.myHero, hero);
                    this.heroesOnline.set(id, this.myHero);
                } else {
                    // If hero is not the player's own hero
                    hero.sprite = new ArcherSprite("red"); // Assuming "red" is the color for archer sprite
                    this.heroesOnline.set(id, hero);
                }
            }
        });
        
        const liveGoblinIds = [];
        serverMsg.goblins.forEach(goblin => {
            liveGoblinIds.push(goblin.id);
            if (this.goblins.has(goblin.id)) {
                Object.assign(this.goblins.get(goblin.id), goblin);
            } else {
                goblin.sprite = new GoblinSprite();
                this.goblins.set(goblin.id, goblin);
            }
        });
        
        for (const id of this.goblins.keys()) {
            if (!liveGoblinIds.includes(id)) {
                this.goblins.delete(id);
            }
        }
        for (const id of this.heroesOnline.keys()) {
            if (!onlineHeroIds.includes(id)) {
                this.heroesOnline.delete(id);
            }
        }
        this.projectiles = serverMsg.projectiles;
    }
}
const gameState = new GameState();
export default gameState;
