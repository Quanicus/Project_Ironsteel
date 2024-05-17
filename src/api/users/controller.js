require("dotenv").config();

const pool = require("../../../db");
const queries = require("./queries");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//this es like basically a list of middleware
const getUsers = (req, res) => {
    pool.query(queries.getUsers, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};
const addUser = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
    if (!name || !email || !password || !passwordConfirm) {
        return res.status(400).json({ error: "Bad Request", message: "Missing input fields" });
    }
    //encrypt password
    password.value = await bcrypt.hash(password.value, 10);
    pool.query(queries.addUser, [name.value, email.value, password.value], (error, results) => {
        if (error) {
        console.log("Failed to add user: ", error);
        return res.status(409).send("unable to add new user");
        }
        
        const filePath = path.join(__dirname, "../../..", "public", "views", "login.html");
        return res.status(201).sendFile(filePath);
    }) 

}
const updateUser = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getUserByID, [id], (error, results) => {
        if (results.rows.length <= 0) {
            return res.send("user does not exist");
        }

        pool.query(queries.updateUser, [], (error, results) => {
            if (error) throw error;
            res.status(200).send("user successfully updated");
        });
    })
}
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getUserByID, [id], (error, results) => {
        if (results.rows.length <= 0) {
            res.send("user does not exist");
        }

        pool.query(queries.deleteUser, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send("user deleted into the shadow realm");
        });
    })
}
const getUserByID = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getUserByID, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}
const checkEmailForm = (req, res) => {
    const { email } = req.body;
    console.log("check form ", email);
    
    pool.query(queries.checkEmailExists, [email.value], (error, results) => {
        if (error) throw error;
        console.log(results.rows);
        res.send(`
            <div id="email-wrap">
                <input 
                    hx-post="/api/v1/users/checkEmail" 
                    hx-trigger="validateEmail" 
                    hx-target="#email-wrap" 
                    hx-swap="outerHTML swap:0s" 
                    valid="${results.rows.length === 0}" 
                    value="${email.value}"
                    type="email" id="email" name="email" placeholder="Email" 
                        required>
                <span>
                    ${results.rows.length === 0 ? "this seems legit" : "she's taken" }
                </span>
            </div>
        `);
    });
}
const authenticate = (req, res) => {
    return res.status(200).json({message: "Token authenticated"});
}

module.exports = {
    getUsers,
    getUserByID,
    addUser,
    deleteUser,
    updateUser,
    checkEmailForm,
    authenticate,
};