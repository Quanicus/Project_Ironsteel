const pool = require("../../db");
const gameQuery = require("../api/game/queries");

class GameLoop {
    constructor() {
        this.connectionSet = new Set();
        this.loop = null;
        //this.publishToClients = this.publishToClients.bind(this);
        console.log("game loop created");
    }
    start() {
        console.log("starting loop")
        this.loop = setInterval(this.publishToClients.bind(this), 1000/60); //loop at /60 fps
    }
    stop() {
        clearInterval(this.loop);
    }
    addConnection(connection) {
        this.connectionSet.add(connection);
        if (this.connectionSet.size === 1) {
            this.start();
        }
        console.log("connection added to loop");
    }
    removeConnection(connection) {
        this.connectionSet.delete(connection);
        if(this.connectionSet.size === 0) {
            this.stop();
        }
    }
    async publishToClients() {
        //get collection of online characters
        let charactersOnline = null;

        try {
            const onlineResults = await pool.query(gameQuery.getOnlineCharacters);
            charactersOnline = onlineResults.rows;

        } catch (error) {
            console.log("Error retrieving online characters, ", error);
        }
        // iterate through the connections and configure a custom payload
        this.connectionSet.forEach(ws => {
            const user = ws.user;
            //retrieve and organize data
            const myData = charactersOnline.find(character => character.player_id == user.id);
            const message = {
                type: "update",
                playersOnline: charactersOnline,
                myData: myData,
            };
            ws.send(JSON.stringify(message));
            //send data
        });
    }
    async getDrawData(ws) {
        //get character and server data
        try {
            const results = await pool.query(gameQuery.getCharacterById, [ws.user.id]);
            const characterData = results.rows[0];
        } catch (error) {
            console.log("Unable to obtain draw data: ", error);
        }
    }
    calculateViewport(characterData) {
        const {position_x: x, position_y: y} = characterData;
    }
}
module.exports = GameLoop;