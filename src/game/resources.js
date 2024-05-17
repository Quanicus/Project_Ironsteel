export const resources = {
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
                red_warrior: "/game/sprites/Factions/Knights/Warrior/Red/Warrior_Red.png"
            },
        }
    }
}

// gonna make a thing to turn all these into img elements. generateImg() mayhaps?



//loop to add walls after