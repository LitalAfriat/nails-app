import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { pool } from "../database/pgHandler";

export { sendEmailCode, sendCode };

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function random6DigitCode(): string {
    return (Math.floor(Math.random() * 900000) + 100000).toString();
}

async function sendEmailCode(req: Request, res: Response) {
    const DigitCode = random6DigitCode();
    const email = req.body.email;

    // Delete any previous unused codes for this email
    await pool.query(`DELETE FROM email_verification_codes WHERE email = $1`, [
        email,
    ]);

    // Store the new code in the DB
    await pool.query(
        `INSERT INTO email_verification_codes (email, code) VALUES ($1, $2)`,
        [email, DigitCode],
    );

    const emailRespond = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Nails App Email Verification Code.",
        html: `<p> ${DigitCode} </p>`,
    });
    console.log(email, DigitCode);

    return res.status(200).json({});
}

async function sendCode(req: Request, res: Response) {
    const { verificationCode } = req.body;

    console.log("Received code:", verificationCode);

    const success = true;

    return res.status(200).json({ success, message: "Code sent successfully" });
}
