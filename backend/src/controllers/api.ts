import { Request, Response } from "express";
import nodemailer from "nodemailer";
import {
    storeCode,
    verifyCode,
    addClientUser,
    addBusinessUser,
} from "../database/pgHandler";
import jwt from "jsonwebtoken";

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

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Nails App Email Verification Code.",
        html: `<p> ${DigitCode} </p>`,
    });

    return res.status(200).json({});
}

function generateUID(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(9));
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .slice(0, 12);
}

async function sendCode(req: Request, res: Response) {
    const { email, verificationCode, connectionType } = req.body;

    const success = await verifyCode(email, verificationCode);
    const uID = generateUID();
    const token = jwt.sign(
        { userId: uID, email: email },
        process.env.JWT_SECRET!,
        { expiresIn: "120d" },
    );

    if (success) {
        if (connectionType?.current === "client") {
            const userId = await addClientUser(uID, email, token);
        } else {
            const userId = await addBusinessUser(uID, email, token);
        }

        return res
            .status(200)
            .json({ success: true, message: "הקוד אומת בהצלחה" });
    } else {
        return res
            .status(400)
            .json({ success: false, message: "קוד לא תקין או פג תוקף" });
    }
}
