const {Pool} = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
    user: "quanicus",
    host: "localhost",
    database: "iron_steel",
    password: process.env.DB_PASSWORD,
    port: 5432
})

//RUNNER LOGIC
async function runMigrations() {
    const client = await pool.connect();
    const schemaSearch = `
        SELECT EXISTS (
            SELECT 1
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public'
            AND c.relname = 'schema_migrations'
            AND c.relkind = 'r'
        );
    `;
    const migrationSearch = `
        SELECT id, version
        FROM schema_migrations
        ORDER BY version DESC
        LIMIT 1
    `;

    try {
        await client.query("BEGIN");

        // check schema_migrations table for applied migrations
        //let queryResult = {rows: [{id: 0, version: 0}]};
        let currentAppliedMigration = {id: 0, version: 0};
        try {
            let queryResult = await client.query(schemaSearch);
            const exists = queryResult.rows[0].exists;
            if (exists) {
                queryResult = await client.query(migrationSearch);
                currentAppliedMigration = queryResult.rows[0];
            }
        } catch (error) {
            console.log("error checking schema_migrations: ", error)
        }
        
        // check for gaps in applied migrations
        if ( currentAppliedMigration.id !== parseInt(currentAppliedMigration.version)) {
            throw new Error(`Current migration index ${currentAppliedMigration.id} does not match the prefix most recent applied migration (${currentAppliedMigration.version})`);
        }
        // get list of migration files and filter out applied migrations
        const pendingMigrations = fs.readdirSync("./migrations")
            .filter((fileName) => parseInt(fileName, 10) > currentAppliedMigration.id);
        // check if pending migration is next expected in sequence ** if not then the system will not boot if the current migrations are invalid.
        if ( pendingMigrations.length > 0 
        && parseInt(pendingMigrations[0], 10) !== currentAppliedMigration.id + 1) {
            throw new Error(`The current applied migration version: ${currentAppliedMigration.version} does not correctly precede the next pending migration version: ${pendingMigrations[0]}`);
        }
        // apply pending migrations
        for (const file of pendingMigrations) {
            const migration = require('./migrations/' + file);
            
            await migration.up(client);
            console.log(`Applied migration: ${file}`);
        }

        await client.query("COMMIT");
        console.log("DB migration process completed.");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Migration failed: ", error);
        throw error;
    } finally {
        await client.release();
    }
}
runMigrations();
module.exports = pool;