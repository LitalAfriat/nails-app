import { Pool } from "pg";

import { generateJWToken } from "../utils/jwt";

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

export {
    initDB,
    storeCode,
    verifyCode,
    addClientUser,
    addBusinessUser,
    generateUID,
};

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
        code = EXCLUDED.code,
        updated_on = NOW()`,
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
        return false; // ❌
    }

    return true;
}

async function addClientUser(email: string) {
    const uid = generateUID();

    const token = await generateJWToken(email, uid);

    await pool.query(
        `INSERT INTO clientUser (id, client, token) VALUES ($1, $2, $3)
         ON CONFLICT (client)                                   
         DO UPDATE SET
             token = EXCLUDED.token,
             updated_on = NOW()`,
        [uid, email, token],
    );
}

async function addBusinessUser(email: string) {
    const uid = generateUID();
    const token = await generateJWToken(email, uid);

    await pool.query(
        `INSERT INTO businessUser (id, business, token) VALUES ($1, $2, $3)
         ON CONFLICT (business)
         DO UPDATE SET
             token = EXCLUDED.token,
             updated_on = NOW()`,
        [uid, email, token],
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
                created_at TIMESTAMP DEFAULT NOW(),
                updated_on TIMESTAMP DEFAULT NOW()

            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS clientUser (
                id TEXT NOT NULL UNIQUE,
                client VARCHAR(255) UNIQUE,
                token TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_on TIMESTAMP DEFAULT NOW()
                
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS businessUser (
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

// Utilis Functions:

function generateUID(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(9));
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .slice(0, 12);
}
