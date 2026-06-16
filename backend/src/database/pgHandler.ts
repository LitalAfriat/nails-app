import { Pool } from "pg";

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

export { initDB, storeCode, verifyCode, addClientUser, addBusinessUser };

async function initDB(): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query("SELECT 1");
        console.log("✅ Database connected successfully!");

        await initTables();
        console.log("✅ Tables are ready!");
    } catch (err) {
        console.error("❌ Database connection failed:", (err as Error).message);
        throw err;
    } finally {
        client.release();
    }
}
async function storeCode(email: String, code: String) {
    await pool.query(
        `INSERT INTO email_verification_codes (email, code)
        VALUES ($1, $2) 
        ON CONFLICT (email)
        DO UPDATE SET
        code = EXCLUDED.code`,
        [email, code],
    );
}

async function verifyCode(email: string, inputCode: string): Promise<boolean> {
    const result = await pool.query(
        `SELECT * FROM email_verification_codes
        WHERE email = $1
        AND code = $2
        LIMIT 1`,
        [email, inputCode],
    );

    if (result.rows.length === 0) {
        return false; // ❌ wrong code, expired, or already used
    }

    return true;
}

async function addClientUser(id: string, email: string, token: string) {
    await pool.query(
        `INSERT INTO client (id, client, token) VALUES ($1, $2, $3)
         ON CONFLICT (client)
         DO UPDATE SET
             token = EXCLUDED.token,
             updated_on = NOW()`,
        [id, email, token],
    );
}

async function addBusinessUser(id: string, email: string, token: string) {
    await pool.query(
        `INSERT INTO business (id, business, token) VALUES ($1, $2, $3)
         ON CONFLICT (business)
         DO UPDATE SET
             token = EXCLUDED.token,
             updated_on = NOW()`,
        [id, email, token],
    );
}
async function initTables(): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS email_verification_codes (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE,
                code VARCHAR(6) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS client (
                id TEXT NOT NULL UNIQUE,
                client VARCHAR(255) UNIQUE,
                token TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_on TIMESTAMP DEFAULT NOW()
                
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS business (
                id TEXT NOT NULL UNIQUE,
                business VARCHAR(255) UNIQUE,
                token TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_on TIMESTAMP DEFAULT NOW()
            )
        `);
    } finally {
        // Fix: always release the client to prevent connection leak
        client.release();
    }
}
