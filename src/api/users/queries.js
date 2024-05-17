const getUsers = `
    SELECT 
        * 
    FROM 
        users.user_info
`;
const getUserByID = `
    SELECT 
        * 
    FROM 
        users.user_info
    WHERE id = $1
`;
const getUserByEmail = `
    SELECT
        *
    FROM
        users.user_info
    WHERE email = $1
`;
const checkEmailExists = `
    SELECT 
        * 
    FROM 
        users.user_info u 
    WHERE u.email = $1
`;
const addUser = `
    INSERT INTO 
        users.user_info
        (name, email, password) 
    VALUES 
        ($1, $2, $3)
`;
const updateUser = "UPDATE user_information ";
const deleteUser = `
    DELETE FROM 
        users.user_info
    WHERE id = $1
`;
module.exports = {
    getUsers,
    getUserByEmail,
    getUserByID,
    checkEmailExists,
    addUser,
    deleteUser,
}