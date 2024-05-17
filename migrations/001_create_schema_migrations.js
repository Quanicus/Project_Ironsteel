async function up (client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY, 
      version VARCHAR(255) NOT NULL UNIQUE, 
      description TEXT,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  await client.query(`
    INSERT INTO schema_migrations (version, description)
    VALUES ('001_create_schema_migrations.sql', 'Create schema_migrations table.');
  `);
}

module.exports = {up};
