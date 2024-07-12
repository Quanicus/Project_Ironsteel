const pool = require("../../../db");
const messageQueries = require("./queries");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getMessages = (req, res) => {
    pool.query(messageQueries.getMessagesById, [user.id], (error, results) => {
       if (error) throw error;
       res.status(200).json(results.rows); 
    });
}
const sendMessage = (req, res) => {
    const args = [sender_id, recipient_id, subject, content];
    pool.query(messageQueries.getMessages, args, (error, results) => {

    })
}

module.exports = {
    getMessages,
}