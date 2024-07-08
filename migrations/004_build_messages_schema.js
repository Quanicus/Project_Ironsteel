async function up(client) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            reply_to_id INT,
            from_user_id INT NOT NULL,
            to_user_id INT NOT NULL,
            subject VARCHAR(255) DEFAULT 'message',
            content TEXT,
            sent_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reply_to_id) REFERENCES messages(id) ON DELETE CASCADE, 
            FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    await client.query(`
        INSERT INTO schema_migrations (version, description)
        VALUES ('004_build_messages_schema.js', 'Built heros schema.');
    `);
    console.log('messages table successfully added.')
}

module.exports = {up};
