const pool = require("../../../db");
const messageQueries = require("./queries");
const userQueries = require("../users/queries");
const nodemailer = require("nodemailer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getRecievedMessages = (req, res) => {
    pool.query(messageQueries.getRecievedMessagesById, [req.user.id], (error, results) => {
       if (error) throw error;
       return res.status(200).json(results.rows); 
    });
}
const getMessageThread = (req, res) => {
    pool.query(messageQueries.getMessageThread, [req.query.threadId], (error, results) => {
        if (error) throw error;
        return res.status(200).json(results.rows);
    });
}
const getSentMessages = (req, res) => {
    pool.query(messageQueries.getSentMessagesById, [req.user.id], (error, results) => {
       if (error) throw error;
       return res.status(200).json(results.rows); 
    });
}
const readMessage = async (req, res) => {
    const msgId = req.body.msgId;
    const queryString = `
        UPDATE messages
        SET read = TRUE
        WHERE id = $1
    `;

    pool.query(queryString, [msgId], (error) => {
        if (error) {
            console.log("Unable to mark message as read.");
        } else {
            return res.status(201).send("message read");
        }
    });
};
const sendMessage = async (req, res) => {
    //console.log("sending?");
    const senderId = req.user.id;
    const {subject, content, replyAddr, threadId, parentId} = req.body;

    const results = await pool.query(userQueries.getUserByEmail, [replyAddr]);
    const recipient = results.rows[0];
    if (!recipient) {
        console.log("failed to find recipent:", recipient);
        return res.status(404).send(`Target recipient: ${replyAddr} not found.`);
    }
    const recipientId = recipient.id;
    const sendMessage = `
    INSERT INTO messages (sender_id, recipient_id, subject, content, thread_id, parent_id)
    VALUES ($1, $2, $3, $4, ${threadId ? "$5, $6" : "DEFAULT, NULL"})
`;
    const args = [senderId, recipientId, subject, content];
    if (threadId) args.push(threadId, parentId);
    console.log(args);
    pool.query(sendMessage, args, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(400).send("bad request");
        } else {
            console.log("message posted");
            return res.status(201).send("message sent");
        }
    })
}

const sendContactMessage = async (req, res) => {
    console.log(req.body);
    const form = req.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'qpham09@gmail.com',
            pass: 'knhm uzly btfn ptif'
        }
    });

    const mailOptions = {
        // from: 'joff@gmail.com',
        to: 'qpham09@gmail.com',
        subject: form.email + ": " + form.subject,
        text: form.message
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
    res.send("aight");
}

module.exports = {
    getMessageThread,
    getRecievedMessages,
    getSentMessages,
    readMessage,
    sendMessage,
    sendContactMessage,
}
