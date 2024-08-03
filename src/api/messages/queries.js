const getMessagesById = `
    SELECT *
    FROM messages 
    WHERE sender_id = $1 OR recipient_id = $1
`;
const getRecievedMessagesById = `
    SELECT *
    FROM messages JOIN users
    ON messages.sender_id = users.id
    WHERE recipient_id = $1
`;
const getSentMessagesById = `
    SELECT *
    FROM messages JOIN users
    ON messages.recipient_id = users.id
    WHERE sender_id = $1
`;
const sendMessage = `
    INSERT INTO messages (sender_id, recipient_id, subject, content)
    VALUES ($1, $2, $3, $4)
`;

module.exports = {
    getMessagesById,
    getRecievedMessagesById,
    getSentMessagesById,
    sendMessage
}