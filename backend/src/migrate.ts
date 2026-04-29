import { pool } from "./db";

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS clients (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                client_id INT REFERENCES clients(id),
                date TIMESTAMP NOT NULL,
                service VARCHAR(100),
                notes TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log("✅ Tables created successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating tables:", err);
        process.exit(1);
    }
};

createTables();
