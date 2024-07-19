const bcrypt = require("bcrypt");
const pool = require("../../../db");
const queries = require("./queries");
const jwt = require("jsonwebtoken");

function validateCredentials(req, res, next) {
    const { name, email, password, passwordConfirm } = req.body;
    const errors = {};

    if (name) {
        const nameValue = name.toLowerCase().trim();
        req.body.name = { value: nameValue};
        const nameRegex = /^[a-zA-Z0-9]{3,}$/;

        if(!nameRegex.test(nameValue)) {
            errors.name = "Invalid name";
        }
    }

    if (email) {
        const emailValue = email.toLowerCase().trim();
        req.body.email = { value: emailValue};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!emailRegex.test(emailValue)) {
            errors.email = "Invalid email";
        }  
    }

    if (password) {
        req.body.password = { value: password };
        const passwordRegex = /[^\s\x00-\x1F\x7F"'/<>%&|]{8,}$/;

        if(!passwordRegex.test(password)) {
            errors.password = "Invalid password";
        }
    }

    if (passwordConfirm) {
        req.body.passwordConfirm = { value: passwordConfirm };

        if(passwordConfirm !== password) {
            errors.passwordConfirm = "Passwords do not match";
        }
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    next();
};

async function verifyCredentials(req, res, next) {
    const { email, password } = req.body;
    req.body.user = null;
    req.body.isVerified = false;
    req.body.err = "Failed to verify user";
    //console.log(email);
    if (!email || !password) {
        return res.status(422).send("<div>bad request dog. terrible even.</div>");
    }
    console.log(email, password);
    pool.query(queries.getUserByEmail, [email.value], async (error, results) => {
        if (error) {
            console.error("Error querying user by id.", error);
            return res.status(422).send("<div>uhoh not found dog</div>");
        }
        if (results.rowCount === 0) {
            return res.status(422).send("<div>uhoh not found dog</div>");
        }
        const user = results.rows[0];
        const hashedPassword = user.password;

        const verified = await bcrypt.compare(password.value, hashedPassword);
        if (!verified) return res.status(422).send("<div>hmm r u really sure this is u?</div>");

        req.body.user = user;
        next();
    });
}

async function issueTokens(req, res) {
    //construct data to be serialized
    const user = {
        id: req.body.user.id,
        role: "user"
    };
    // Generate tokens
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '4w' });

    //set tokens as a cookie
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    //STORE SESSION INFO IN DB
    try {
        await pool.query(`
            INSERT INTO refresh_tokens (user_id, token, expires_at)
            VALUES ($1, $2, CURRENT_DATE + INTERVAL '4 weeks');
        `, [req.body.user.id, refreshToken]);    
    } catch (error) {
        if (error.code == 23505) {
            console.log("You are already logged in.");
            await pool.query(`
                UPDATE refresh_tokens
                SET token = $1, expires_at = CURRENT_DATE + INTERVAL '4 weeks'
                WHERE user_id = $2
            `, [refreshToken, req.body.user.id]);
        } else {
            throw error;
        }
    }

    return res.send("User successfully logged in.");
}

function authenticateToken(req, res, next) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {//user not logged in
        return res.sendStatus(401);
    } 
    //verify access token
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {//access token denied
            //verify refresh token
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) {//refresh token denied
                    return res.status(401);
                }
                //issue new access token
                const newAccessToken = jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
                res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });

            });
        }//grant acess
        req.user = user;
        return next();
    });
}

module.exports = {
    authenticateToken,
    validateCredentials,
    verifyCredentials,
    issueTokens,
    authenticateToken,
};