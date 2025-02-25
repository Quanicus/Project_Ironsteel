async function up(client) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            original_msg_id INT,
            sender_id INT NOT NULL,
            recipient_id INT NOT NULL,
            subject VARCHAR(255) DEFAULT 'message',
            content TEXT DEFAULT 'i love you ehe',
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (original_msg_id) REFERENCES messages(id) ON DELETE CASCADE, 
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);


    // await client.query(`
    //     CREATE TABLE IF NOT EXISTS guest_messages (
    //         id SERIAL PRIMARY KEY,
    //         sender_id INT NOT NULL,
    //         subject VARCHAR(255) DEFAULT 'message',
    //         content TEXT DEFAULT 'i love you too ehe',
    //         sent_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //         FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    //     );    
    // `);

    await client.query(`
        INSERT INTO schema_migrations (version, description)
        VALUES ('004_build_messages_schema.js', 'Built messages schema.');
    `);
    console.log('messages table successfully added.')
}

module.exports = {up};
