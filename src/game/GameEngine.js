const pool = require("../../db");
const gameQueries = require("../api/game/queries.js");
const gameEngine = {

    processDirection: async (id, directionVector) => {
        const actionResult = await pool.query(gameQueries.getCurrentActionById, [id]);
        const currentAction = actionResult.rows[0].current_action;
        if (!directionVector) {
            if (currentAction !== "chargingBow"){
                await pool.query(gameQueries.setActionById, ["idle", id]);
            }
            return;
        }

        const { directionX, directionY } = directionVector;
        const moveSpeed = 2;

        let query = "UPDATE heros SET ";
        let updates = [];
        
        
        
        if (currentAction === "idle") {
            await pool.query(gameQueries.setActionById, ["running", id]);
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
    
        const queryParams = [0, id];
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
    processChargeStart: async (id, clickData) => {
        const {x, y, displayWidth: width, displayHeight: height} = clickData;
        const center = { x: width/2, y: height/2 };
        const relativeX = x - center.x; 
        const relativeY = center.y - y;
        const angle = Math.atan2(relativeY, relativeX) * (180/Math.PI);
        
        let direction;
        if (angle > -157.5 && angle < -112.5) {
            direction = "NE";
        } else if (angle >= -112.5 && angle <= -67.5) {
            direction = "N";
        } else if (angle > -67.5 && angle < -22.5) {
            direction = "NW";
        } else if (angle >= -22.5 && angle <= 22.5) {
            direction = "W";
        } else if (angle > 22.5 && angle < 67.5) {
            direction = "SW";
        } else if (angle >= 67.5 && angle <= 112.5) {
            direction = "S";
        } else if (angle > 112.5 && angle < 157.5) {
            direction = "SE";
        } else {
            direction = "E";
        }
        try {
            await pool.query(gameQueries.setActionById, ["chargingBow", id]);
            await pool.query(gameQueries.setDirectionAimingById, [id, direction]);
        } catch (error) {
            console.error("failed to start charging", error)
        }
    },
    processBowCharge: async (id) => {
        let hero = null;
        let result;
        try {
            result = await pool.query(gameQueries.getHeroById, [id]);
            hero = result.rows[0];
        } catch (error) {
            console.error("error querying for hero", error);
            return;
        }
        let chargeLvl = hero.charge_lvl;
        let chargePct = hero.charge_pct;

        if (chargeLvl >= 5) return;

        chargePct += 50;
        if (chargePct >= 100) {
            chargePct = 0;
            chargeLvl++;
        }
        try {
            await pool.query(gameQueries.setActionById, ["chargingBow", id]);
            result = await pool.query(gameQueries.setBowChargeById, [id, chargeLvl, chargePct]);
        } catch (error) {
            console.error("failed to set charge data", error);
        }
        //console.log(chargeLvl, chargePct);
    },
    processBowRelease: async (id, clickData) => {
        const {x, y, displayWidth: width, displayHeight: height} = clickData;
        const center = { x: width/2, y: height/2 };
        const relativeX = x - center.x; 
        const relativeY = center.y - y;
        const angle = Math.atan2(relativeY, relativeX) * (180/Math.PI);
        
        let aimAngle;
        if (angle <= 0) {
            aimAngle = angle + 180;
        } else {
            aimAngle = angle - 180;
        }
        console.log(aimAngle);
        let chargeLvl;
        try {
            const result = await pool.query(gameQueries.getHeroById,[id]);
            chargeLvl = result.rows[0].charge_lvl;
            await pool.query(gameQueries.releaseBowById,[id]);
        } catch (error) {
            console.error("", error);
        }
        if (chargeLvl == 5) {
            console.log("BANG");
        }
    },
    processAimBow: async (id, clickData) => {
        const {x, y, displayWidth: width, displayHeight: height} = clickData;
        const center = { x: width/2, y: height/2 };
        const relativeX = x - center.x; 
        const relativeY = center.y - y;
        const angle = Math.atan2(relativeY, relativeX) * (180/Math.PI);
        let direction;
        if (angle > -157.5 && angle < -112.5) {
            direction = "NE";
        } else if (angle >= -112.5 && angle <= -67.5) {
            direction = "N";
        } else if (angle > -67.5 && angle < -22.5) {
            direction = "NW";
        } else if (angle >= -22.5 && angle <= 22.5) {
            direction = "W";
        } else if (angle > 22.5 && angle < 67.5) {
            direction = "SW";
        } else if (angle >= 67.5 && angle <= 112.5) {
            direction = "S";
        } else if (angle > 112.5 && angle < 157.5) {
            direction = "SE";
        } else {
            direction = "E";
        }
        
        try {
            await pool.query(gameQueries.setDirectionAimingById, [id, direction]);
        } catch (error) {
            console.error("failed while aiming", error)
        }

        
    }, 
    aimBow: async (id, mouseData) => {

    }
}
module.exports = gameEngine;