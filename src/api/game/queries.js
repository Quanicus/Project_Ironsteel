const getCharacterById = `
    SELECT *
    FROM characters
    WHERE player_id = $1
`;
const addCharacter = `
    INSERT INTO characters (player_id)
    VALUES ($1)
`;
const getOnlineCharacters = `
    SELECT * 
    FROM characters
    WHERE isOnline = TRUE
`;
const setOnline = `
    UPDATE characters
    SET isOnline = TRUE
    WHERE player_id = $1
`;
const setOffline = `
UPDATE characters
SET isOnline = FALSE
WHERE player_id = $1
`;
module.exports = {
    getCharacterById,
    addCharacter,
    getOnlineCharacters,
    setOnline,
    setOffline,
}