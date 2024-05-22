const pool = require("../../db");

const gameEngine = {

    processDirection: async (ws, directionVector) => {
        const { directionX, directionY } = directionVector;
        const moveSpeed = 5;
        console.log("directionX: ", directionX);
        console.log("directionY: ", directionY);
        let query = "UPDATE characters SET ";
        
        let updates = [];
        
        if (directionX === "a") {
            updates.push("position_x = position_x - $1");
        } else if (directionX === "d") {
            updates.push("position_x = position_x + $1");
        }
       
        if (directionY === "w") {
            updates.push("position_y = position_y - $1");
        } else if (directionY === "s") {
            updates.push("position_y = position_y + $1");
        }
    
        const queryParams = [0, ws.user.id];
        if (updates.length === 2) {
            query += updates.join(", ");
            queryParams[0] = moveSpeed * 0.707;
        } else {
            query += updates;
            queryParams[0] = moveSpeed;
        }
        query += " WHERE player_id = $2";

        await pool.query(query, queryParams);
        
    },
}
module.exports = gameEngine;