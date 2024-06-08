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
            { // 1st argument sets which properties to pass to ws object, in this case ip address
                user: user, 
                lastChargeTimestamp: 0,
                lastAimTimestamp: 0,
            }, 
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
            await pool.query(gameQuery.addHero, [user.id]);

        } catch (error) {
            if (error.code == 23505) {
                console.log("welcome returning player");
                await pool.query(gameQuery.setOnline, [user.id])
            }   
        }
        const heroResult = await pool.query(gameQuery.getHeroById, [user.id]);
        user.hero = heroResult.rows[0];

        ws.subscribe("chat");
        gameLoop.addConnection(ws);
    },
    message: (ws, message, isBinary) => {
        //calculate movement and update db entries
        const user = ws.user;
        const text = decoder.decode(message);
        const msgObj = JSON.parse(text);
        const currentTimestamp = Date.now();

        switch (msgObj.type) {
            case "chat":
                msgObj.name = user.hero.name;
                console.log(msgObj);
                wsServer.publish("chat", JSON.stringify(msgObj));
                break;
            case "direction":
                gameEngine.processDirection(ws.user.id, msgObj.payload);
                break;
            case "startCharge":
                gameEngine.processChargeStart(ws.user.id, msgObj.payload);
                break;
            case "chargeBow":
                if (currentTimestamp - ws.lastChargeTimestamp < 100) {return;}
                ws.lastChargeTimestamp = currentTimestamp;
                gameEngine.processBowCharge(ws.user.id, msgObj.payload);
                break;
            case "aimBow":
                if (currentTimestamp - ws.lastAimTimestamp < 10) {return;}
                ws.lastAimTimestamp = currentTimestamp;
                gameEngine.processAimBow(ws.user.id, msgObj.payload);
                break;
            case "releaseBow":
                gameEngine.processBowRelease(ws.user.id, msgObj.payload);
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