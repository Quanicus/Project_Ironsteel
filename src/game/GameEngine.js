const pool = require("../../db");
const gameQueries = require("../api/game/queries.js");
const gameEngine = {

    processDirection: async (ws, directionVector) => {
        if (!directionVector) {
            await pool.query(gameQueries.setActionById, ["idle", ws.user.id]);
            return;
        }

        const { directionX, directionY } = directionVector;
        const moveSpeed = 10;

        let query = "UPDATE heros SET ";
        let updates = [];
        
        const actionResult = await pool.query(gameQueries.getCurrentActionById, [ws.user.id]);
        const currentAction = actionResult.rows[0].current_action;
        
        if (currentAction === "idle") {
            await pool.query(gameQueries.setActionById, ["walking", ws.user.id]);
        }

        if (directionX === "a") {
            updates.push("position_x = position_x - $1");
            updates.push("direction_facing = 'left'")
        } else if (directionX === "d") {
            updates.push("position_x = position_x + $1");
            updates.push("direction_facing = 'right'")
        }
       
        if (directionY === "w") {
            updates.push("position_y = position_y - $1");
        } else if (directionY === "s") {
            updates.push("position_y = position_y + $1");
        }
    
        const queryParams = [0, ws.user.id];
        if (updates.length > 1) {
            query += updates.join(", ");
            queryParams[0] = moveSpeed * 0.7;
        } else {
            query += updates;
            queryParams[0] = moveSpeed;
        }
        query += " WHERE player_id = $2";

        await pool.query(query, queryParams);
        
    },
}
module.exports = gameEngine;