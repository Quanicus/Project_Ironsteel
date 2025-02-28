const getMessagesById = `
    SELECT *
    FROM messages 
    WHERE sender_id = $1 OR recipient_id = $1
`;
const getRecievedMessagesById = `
    SELECT DISTINCT ON (m.thread_id) m.*, u.email, u.name
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.recipient_id = $1
    ORDER BY m.thread_id, m.date DESC;
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