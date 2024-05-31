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
                red: {
                    warrior: "/game/sprites/Factions/Knights/Troops/Warrior/Red/Warrior_Red.png",
                    archer: "/game/sprites/Factions/Knights/Troops/Archer/Archer_Red.png",
                },
                blue: {
                    archer: "/game/sprites/Factions/Knights/Troops/Archer/Archer_Blue.png",
                },
            },
        }
        this.images = {};
        this.terrainMatrix = null;
        this.terrainIsLoaded = false;
        this.loadTerrain();
        this.loadTerrainMatrix();
        this.loadFactions();
        
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