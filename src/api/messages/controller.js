const pool = require("../../../db");
const messageQueries = require("./queries");
const userQueries = require("../users/queries");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getRecievedMessages = (req, res) => {
    if (req.isGuest) {
        return res.status(200).send("ur a guest");
    } 
    pool.query(messageQueries.getRecievedMessagesById, [req.user.id], (error, results) => {
       if (error) throw error;
       return res.status(200).json(results.rows); 
    });
}
const getSentMessages = (req, res) => {
    if (req.isGuest) {
        return res.status(200).send("ur a guest");
    } 
    pool.query(messageQueries.getSentMessagesById, [req.user.id], (error, results) => {
       if (error) throw error;
       return res.status(200).json(results.rows); 
    });
}
const sendMessage = async (req, res) => {
    //console.log("sending?");
    if (req.isGuest || !req.user) {
        res.status(401).send('Access Denied: Authentication Required');
    }
    const senderId = req.user.id;
    let recipientId = null;
    const {subject, content, replyAddr} = req.body;
    if(!replyAddr || replyAddr === "guest") {
        recipientId = 1;
    } else {
        const results = await pool.query(userQueries.getUserByEmail, [replyAddr]);
        const recipient = results.rows[0];
        if (!recipient) {
            return res.status(404).send(`Target recipient: ${replyAddr} not found.`);
        }
        recipientId = recipient.id;
    }
    const args = [senderId, recipientId, subject, content];
    console.log(req.body);
    console.log(`sender: ${senderId}, recipient: ${recipientId}, subject: ${subject}, content: ${content}`);
    pool.query(messageQueries.sendMessage, args, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(400).send("bad request");
        } else {
            console.log("message posted");
            return res.status(201).send("message sent");
        }
    })
}

module.exports = {
    getRecievedMessages,
    getSentMessages,
    sendMessage,
}