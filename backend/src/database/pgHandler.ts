import { Pool } from "pg";

export const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "myappdb",
    user: process.env.DB_USER || "myappuser",
    password: process.env.DB_PASSWORD || "yourpassword",
});

export async function initDB(): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query("SELECT 1");
        console.log("✅ Database connected successfully!");

        // Auto-create table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS email_verification_codes (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                code VARCHAR(6) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '10 minutes',
                used BOOLEAN DEFAULT FALSE
            )
        `);
        console.log("✅ email_verification_codes table ready!");
    } catch (err) {
        console.error("❌ Database connection failed:", (err as Error).message);
        throw err;
    } finally {
        client.release();
    }
}
