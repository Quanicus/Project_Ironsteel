async function up(client) {
    await client.query(`
        CREATE SCHEMA IF NOT EXISTS users;
    `);

    await client.query(`
        CREATE TABLE IF NOT EXISTS users.user_info(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
    `);
    
    await client.query(`
        CREATE TABLE IF NOT EXISTS users.refresh_tokens(
            user_id INT PRIMARY KEY,
            token VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users.user_info(id) ON DELETE CASCADE
        );
    `);

    await client.query(`
        INSERT INTO schema_migrations (version, description)
        VALUES ('002_build_users_schema.sql', 'Build users schema');
    `);
    console.log('user_info table successfully created.');
}

module.exports = {up};

