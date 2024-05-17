const pool = require("../../db");

class GameLoop {
    constructor() {
        this.connectionSet = new Set();
        this.loop = null;
        //this.publishToClients = this.publishToClients.bind(this);
        console.log("game loop created");
    }
    startLoop() {
        console.log("starting loop")
        this.loop = setInterval(this.publishToClients.bind(this), 1000/10); //loop at 10 fps
    }
    stopLoop() {
        clearInterval(this.loop);
    }
    addConnection(connection) {
        this.connectionSet.add(connection);
        if (this.connectionSet.size === 1) {
            this.startLoop();
        }
        console.log("connection added to loop");
    }
    removeConnection(connection) {
        this.connectionSet.delete(connection);
        if(this.connectionSet.size === 0) {
            this.stopLoop();
        }
    }
    async getData(ws) {
        //get character and server data
        try {
            const results = await pool.query()
        } catch (error) {

        }
    }
    publishToClients() {
        this.connectionSet.forEach(ws => {
            //retrieve and organize data
            ws.send(JSON.stringify({type: "refresh"}));
            //send data
        });
    }
}
module.exports = GameLoop;