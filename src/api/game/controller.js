const jwt = require("jsonwebtoken");
const getCharacter = (req, res) => {
    
};
const issueGameKey = (req, res) => {
    const user = {};
    user.id = req.user.id;
    const gameKey = jwt.sign(user, process.env.GAME_KEY_SECRET, { expiresIn: '5m' });
    res.cookie('gameKey', gameKey, {
        //domain: 'project-fireflame.onrender.com', // Leading dot allows subdomains
        path: '/',
        secure: true, // true if using HTTPS
        httpOnly: true, // true if you want the cookie to be HTTP-only
        sameSite: 'None', // Necessary for cross-site cookies
        maxAge: 5 * 60 * 1000 // 5 mins
    });
    console.log("cookie set?");
    res.json(gameKey);
};

module.exports = {
    issueGameKey,
};