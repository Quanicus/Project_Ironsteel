async function up(client) {

    await client.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
    `);
    await client.query(`
        INSERT INTO users (name, email, password)
        VALUES ('guest', 'guest', 'tacosasusage')
    `);
    
    await client.query(`
        CREATE TABLE IF NOT EXISTS refresh_tokens(
            user_id INT PRIMARY KEY,
            token VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    await client.query(`
        INSERT INTO schema_migrations (version, description)
        VALUES ('002_build_users_schema.js', 'Build users schema');
    `);
    console.log('users table successfully created.');
}

module.exports = {up};

