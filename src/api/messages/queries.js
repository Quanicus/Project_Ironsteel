const getMessagesById = `
    SELECT *
    FROM messages
    WHERE from_user_id = $1 OR to_user_id = $1
`;
const sendMessage = `
    INSERT INTO messages (sender_id, recipient_id, subject, content)
    VALUES ($1, $2, $3, $4)
`;

module.exports = {
    getMessagesById,
    sendMessage
}