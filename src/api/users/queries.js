const getUsers = `
    SELECT 
        * 
    FROM 
        users
`;
const getUserByID = `
    SELECT 
        * 
    FROM 
        users
    WHERE id = $1
`;
const getUserByEmail = `
    SELECT
        *
    FROM
        users
    WHERE email = $1
`;
const checkEmailExists = `
    SELECT 
        * 
    FROM 
        users u 
    WHERE u.email = $1
`;
const addUser = `
    INSERT INTO 
        users
        (name, email, password) 
    VALUES 
        ($1, $2, $3)
`;
const updateUser = "UPDATE usersrmation ";
const deleteUser = `
    DELETE FROM 
        users
    WHERE id = $1
    RETURNING *
`;
const getMessage = `
    SELECT 
        m.message_id,
        m.content,
        m.sent_at,
        u_from.name AS sender_name,
        u_from.email AS sender_email,
        u_to.name AS receiver_name,
        u_to.email AS receiver_email
    FROM 
        messages m
    JOIN 
        users u_from ON m.from_user_id = u_from.user_id
    JOIN 
        users u_to ON m.to_user_id = u_to.user_id
    ORDER BY 
        m.sent_at DESC;

`;
module.exports = {
    getUsers,
    getUserByEmail,
    getUserByID,
    checkEmailExists,
    addUser,
    deleteUser,
}