const jwt = require("jsonwebtoken");
const gameQuery = require("./src/api/game/queries");
const GameLoop = require("./src/game/GameLoop");
const gameEngine = require("./src/game/GameEngine");
const pool = require("./db");

//const gameEngine = new GameEngine();
const gameLoop = new GameLoop();
const decoder = new TextDecoder('utf-8');
const wsServer = require("uWebSockets.js").App().ws("/*", {
    upgrade: (res, req, context) => {
        const cookieHeader = req.getHeader("cookie");
        if (!cookieHeader) {
            console.error("Cookie header not found");
            return res.writeStatus('401').end();
        }
        //get a dictionary of cookies
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split("=");
            acc[name] = value;
            return acc;
        }, {});
        
        const accessToken = cookies["accessToken"];
        if (!accessToken) {
            console.error("JWT token not found in cookie");
            return res.writeStatus('401').end();
        }

        let user = {};
        try { //save decoded user info
            user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            console.error("JWT verification failed:", errormessage);
            return res.writeStatus('401').end();
        }
        //TODO: USE USER_ID TO GET CHARACTER INFO LIKE NAME

        res.upgrade( // upgrade to websocket
            { user: user, }, // 1st argument sets which properties to pass to ws object, in this case ip address
            req.getHeader('sec-websocket-key'),
            req.getHeader('sec-websocket-protocol'),
            req.getHeader('sec-websocket-extensions'), // 3 headers are used to setup websocket
            context // also used to setup websocket
        )
    },
    open: async (ws) => {
        const user = ws.user;
        console.log(`User ${user.id} has connected`)
        //GET CHARDATA
        try {
            await pool.query(gameQuery.addCharacter, [user.id]);

        } catch (error) {
            if (error.code == 23505) {
                console.log("welcome returning player");
                await pool.query(gameQuery.setOnline, [user.id])
            }   
        }
        const characterResult = await pool.query(gameQuery.getCharacterById, [user.id]);
        user.character = characterResult.rows[0];

        ws.subscribe("chat");
        gameLoop.addConnection(ws);
    },
    message: (ws, message, isBinary) => {
        //calculate movement and update db entries
        const user = ws.user;
        const text = decoder.decode(message);
        const msgObj = JSON.parse(text);
        
        switch (msgObj.type) {
            case "chat":
                msgObj.name = user.character.name;
                console.log(msgObj);
                wsServer.publish("chat", JSON.stringify(msgObj));
                break;
            case "direction":
                //console.log(msgObj.payload);
                gameEngine.processDirection(ws, msgObj.payload);
                //const direction = msgObj.payload.direction;
                
                break;
            default:
                console.log("default", msgObj.content);
        }
    },
    close: async (ws, code, message) => {
        const user = ws.user;
        gameLoop.removeConnection(ws);//remove connection from the game loop
        await pool.query(gameQuery.setOffline, [user.id]);
        console.log(`User ${user.id} has disconnected`);
    },
});

const PORT = process.env.PORT || 9001;
wsServer.listen(PORT, (listenSocket) => {
    if (listenSocket) {
        console.log(`WebSocket server listening on port ${PORT}`);
    }
    
});

module.exports = wsServer;