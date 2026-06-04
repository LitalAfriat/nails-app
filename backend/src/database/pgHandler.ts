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
    // Delete any previous unused codes for this email
    await pool.query(`DELETE FROM email_verification_codes WHERE email = $1`, [
        email,
    ]);

    // Store the new code in the DB
    await pool.query(
        `INSERT INTO email_verification_codes (email, code) VALUES ($1, $2) `,
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

async function addClientUser(userid: number, email: string) {
    const result = await pool.query(
        `INSERT INTO client (client) VALUES ($1) RETURNING id`,
        [email],
    );

    const newId = result.rows[0].id;
    console.log("New client ID:", newId);

    return newId;
}
async function addBusinessUser(email: string): Promise<void> {
    // Store the new code in the DB
    await pool.query(`INSERT INTO business (business) VALUES ($1) LIMIT 1`, [
        email,
    ]);
    const result = await pool.query(`SELECT * FROM business`);

    console.log("All business:", result.rowCount);
}

async function initTables(): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS email_verification_codes (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                code VARCHAR(6) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS client (
                id SERIAL PRIMARY KEY,
                client VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS business (
                id SERIAL PRIMARY KEY,
                business VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
    } finally {
        // Fix: always release the client to prevent connection leak
        client.release();
    }
}
