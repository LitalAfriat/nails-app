import { Request, Response } from "express";
import {
    storeCode,
    verifyCode,
    addClientUser,
    addBusinessUser,
    verifyToken,
} from "../database/pgHandler";
import { sendVerificationEmail } from "../utils/nodemailer";
export { sendEmailCode, checkCode, storeCode, checkTokenEmail };

async function sendEmailCode(req: Request, res: Response) {
    try {
        const email = req.body.email;
        await sendVerificationEmail(email);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Something went wrong:", err);
        return res.status(500).json({ success: false });
    }
}

async function checkCode(req: Request, res: Response) {
    try {
        const { email, verificationCode, connectionType } = req.body;
        const success = await verifyCode(email, verificationCode);
        let token;

        if (success) {
            if (connectionType?.current === "client") {
                token = await addClientUser(email);
            } else if (connectionType?.current === "business") {
                token = await addBusinessUser(email);
            } else {
                return res
                    .status(400)
                    .json({ success: false, message: " קיימת שגיאה" });
            }
            return res
                .status(200)
                .json({ success: true, token, message: "הקוד אומת בהצלחה" });
        } else {
            return res
                .status(400)
                .json({ success: false, message: "קוד לא תקין או פג תוקף" });
        }
    } catch (err) {
        console.error("Something went wrong:", err);
        return res.status(500).json({ success: false });
    }
}

async function checkTokenEmail(req: Request, res: Response) {
    try {
        const { email, token, connectionType } = req.body;

        const success = await verifyToken(email, token, connectionType);

        if (success) {
            return res.status(200).json({ success: true, connectionType });
        } else {
            return res
                .status(400)
                .json({ success: false, message: "משתמש לא קיים במערכת" });
        }
    } catch (err) {
        console.error("Something went wrong:", err);
        return res.status(500).json({ success: false });
    }
}
