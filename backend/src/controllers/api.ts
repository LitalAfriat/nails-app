import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { storeCode, verifyCode } from "../database/pgHandler";

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

    await storeCode(email, DigitCode);

    const emailRespond = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Nails App Email Verification Code.",
        html: `<p> ${DigitCode} </p>`,
    });

    return res.status(200).json({});
}

async function sendCode(req: Request, res: Response) {
    const { email, verificationCode } = req.body;

    const success = await verifyCode(email, verificationCode);

    return res.status(200).json({ success, message: "Code sent successfully" });
}
