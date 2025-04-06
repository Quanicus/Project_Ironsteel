class Resources {
    constructor() {
        this.toLoad = {
            terrain: {
                water: "/game/sprites/Terrain/Water/Water.png",
                flatGround: "/game/sprites/Terrain/Ground/Tilemap_Flat.png",
                elevatedGround: "/game/sprites/Terrain/Ground/Tilemap_Elevation.png",
                shadow: "/game/sprites/Terrain/Ground/Shadow.png",
                foam: "/game/sprites/Terrain/Water/Foam.png"
            },
            resources: {},
            factions: {
                warrior: {
                    red: "/game/sprites/Factions/Knights/Troops/Warrior/Red/Warrior_Red.png",
                },
                archer: {
                    red: "/game/sprites/Factions/Knights/Troops/Archer/Archer_Red.png",
                    blue: "/game/sprites/Factions/Knights/Troops/Archer/Archer_Blue.png",
                },
                goblin: {
                    red: "game/sprites/Factions/Goblins/Troops/Torch/Red/Torch_Red.png",
                },
            },
            projectiles: {
                arrow: "/game/sprites/Factions/Knights/Troops/Archer/Arrow/Arrow.png",
            },
            UI: {
                banners: {
                    connection_left: "/game/sprites/UI/Banners/Banner_Connection_Left.png",
                    connection_right: "/game/sprites/UI/Banners/Banner_Connection_Right.png",
                    connection_horizontal: "/game/sprites/UI/Banners/Banner_Horizontal.png",
                },
            },
            health: {
                hearts: "/game/sprites/Health/heart_container.png",   
                bar_deco: "/game/sprites/Health/health_bar_decoration.png",
                bar: "/game/sprites/Health/health_bar.png"
            },
        }
        this.images = {};
        this.terrainMatrix = null;
        this.terrainIsLoaded = false;
        this.loadTerrain();
        this.loadTerrainMatrix();
        this.loadFactions();
        this.loadProjectiles(); 
        this.loadUI();
        this.loadHealth();
    }

    loadTerrain() {
        this.images.terrain = {};
        Object.keys(this.toLoad.terrain).forEach(key => {
            const img = new Image();
            img.src = this.toLoad.terrain[key];
            this.images.terrain[key] = img;
        });
    }

    loadFactions() {
        this.images.factions = {};
        const factions = this.toLoad.factions;
        Object.keys(factions).forEach(color => {
            this.images.factions[color] = {};
            Object.keys(factions[color]).forEach(troop => {
                const img = new Image();
                img.src = factions[color][troop];
                this.images.factions[color][troop] = img;
            });
        })
    }

    loadProjectiles() {
        this.images.projectiles = {};
        const projectiles = this.toLoad.projectiles;
        Object.keys(projectiles).forEach(projectile => {
            const img = new Image();
            img.src = this.toLoad.projectiles[projectile];
            this.images.projectiles[projectile] = img;
        });
    }

    loadUI() {
        this.images.UI = {};
        const UI = this.toLoad.UI;
        Object.keys(UI).forEach(feature => {
            this.images.UI[feature] = {};
            Object.keys(UI[feature]).forEach(element => {
                const img = new Image();
                img.src = UI[feature][element];
                this.images.UI[feature][element] = img;
            });
        });
    }

    loadHealth() {
        this.images.health = {};
        const health = this.toLoad.health;
        Object.keys(health).forEach(display => {
            const img = new Image();
            img.src = health[display];
            this.images.health[display] = img;
        });
    }

    async loadTerrainMatrix() {
        if (this.terrainIsLoaded) return;

        let data = null;
        try {
            const response = await fetch("/game/v1/resource/terrainMatrix");
            if (!response.ok) {throw new Error("Network response not ok");}

            data = await response.json();
        } catch (error) {
            console.error("Problem fetching terrain:", error);
        }
        this.terrainMatrix = data;
        this.terrainIsLoaded = true;
    }
}
const resources = new Resources();
export default resources;
// use this to generate a tilemap for terrain and spritemap for world objects



//loop to add walls after
