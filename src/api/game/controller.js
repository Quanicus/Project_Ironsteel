const pool = require("../../../db");
const jwt = require("jsonwebtoken");
const getCharacter = (req, res) => {
    
};

const verifyCharacter = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const heroQuery = `
        SELECT * 
        FROM heroes
        WHERE player_id = $1;
    `;
    let userId;
    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        userId = user.id;
        const result = await pool.query(heroQuery, [userId]);
        if (result.rowCount > 0) {
            res.status(200).send("Character data found");
        } else {
            console.log("character not found");
            res.status(204).send();
        }
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Token missing or invalid.' });
    }
}

const makeCharacter = async(req, res) => {
    const characterName = req.body.characterName;
    const refreshToken = req.cookies.refreshToken;
    const idQuery = `
        SELECT *
        FROM heroes
        WHERE player_id = $1;
    `;
    const nameQuery = `
        SELECT *
        FROM heroes
        WHERE name = $1;
    `;
    const addHeroQuery = `
        INSERT INTO heroes (player_id, name)
        VALUES ($1, $2);
    `;
    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = user.id;

        let result;
        result = await pool.query(idQuery, [userId]);
        if (result.rowCount > 0) {
            return res.status(422).json({error: "Conflict", message: "You already have a character"});
        }

        result = await pool.query(nameQuery, [characterName]);
        if (result.rowCount > 0) {
            return res.status(409).json({error: "Conflict", message: "Character name already taken"});
        }

        result = await pool.query(addHeroQuery, [userId, characterName]);
        if (result.rowCount === 1) {
            return res.status(201).json({message: "Character successfully created."});
        }
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Token missing or invalid.' });
    }
}

module.exports = {
    makeCharacter,
    verifyCharacter,
};
