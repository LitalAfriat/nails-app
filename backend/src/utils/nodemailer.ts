import nodemailer from "nodemailer";
import { storeCode } from "../database/pgHandler";

export { transporter, random6DigitCode, sendVerificationEmail };

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email: string) => {
    const digitCode = random6DigitCode();

    await storeCode(email, digitCode);

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Nails App Email Verification Code.",
        html: `<p>${digitCode}</p>`,
    });
};

// Utilis Functions:

function random6DigitCode(): string {
    return (Math.floor(Math.random() * 900000) + 100000).toString();
}
