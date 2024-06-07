const getHeroById = `
    SELECT *
    FROM heros
    WHERE player_id = $1
`;
const addHero = `
    INSERT INTO heros (player_id)
    VALUES ($1)
`;
const getOnlineHeros = `
    SELECT * 
    FROM heros
    WHERE isOnline = TRUE
`;
const setOnline = `
    UPDATE heros
    SET isOnline = TRUE
    WHERE player_id = $1
`;
const setOffline = `
    UPDATE heros
    SET isOnline = FALSE
    WHERE player_id = $1
`;
const getCurrentActionById = `
    SELECT current_action
    FROM heros
    WHERE player_id = $1
`;
const setActionById = `
    UPDATE heros
    SET current_action = $1
    WHERE player_id = $2
`;
module.exports = {
    getHeroById,
    addHero,
    getOnlineHeros,
    setOnline,
    setOffline,
    getCurrentActionById,
    setActionById,
}