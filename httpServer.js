require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const pool = require("./db");
const app = express();
const userRoutes = require("./src/api/users/routes.js");
const gameRoutes = require("./src/api/game/routes.js");
const messageRoutes = require("./src/api/messages/routes.js");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use("/api/v1/users", userRoutes);
app.use("/game/v1", gameRoutes);
app.use("/api/v1/messages", messageRoutes);

app.post("/burn-it-down", async (req, res) => {
    console.log(req.body);
    if (req.body.fire === "ignite") {
        pool.query("DROP TABLE schema_migrations, users, refresh_tokens, heros, messages", (err, result) => {
            if (err) {
                console.log("error wiping db", err);
                res.status(500).send("unable to wipe drive");
                return;
                
            } else {
                res.send("its done daddy");
            }
        });
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})

module.exports = app;