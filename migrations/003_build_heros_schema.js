async function up(client) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS heros (
            id SERIAL PRIMARY KEY,
            player_id INT UNIQUE NOT NULL,
            name VARCHAR(16) DEFAULT 'Random Minion',
            position_x REAL DEFAULT 50,
            position_y REAL DEFAULT 50,
            direction_facing VARCHAR(5),
            direction_aiming VARCHAR(2),
            current_action VARCHAR(16) DEFAULT 'idle',
            charge_lvl INT DEFAULT 0,
            charge_pct INT DEFAULT 0,
            level INT DEFAULT 1,
            next_level INT DEFAULT 100,
            experience INT DEFAULT 0,
            max_hp INT DEFAULT 100,
            current_hp INT DEFAULT 100,
            atk INT DEFAULT 5,
            def INT DEFAULT 5,
            isOnline BOOLEAN DEFAULT TRUE,
            
            FOREIGN KEY (player_id) REFERENCES users.user_info(id) ON DELETE CASCADE
        );
    `);

    await client.query(`
        INSERT INTO schema_migrations (version, description)
        VALUES ('003_build_heros_schema.sql', 'Built heros schema.');
    `);
    console.log('refresh_tokens table successfully added.')
}

module.exports = {up};
