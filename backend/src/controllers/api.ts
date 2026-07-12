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
    //TODO add try and catch + check if email was sent succesfuly
    const email = req.body.email;

    await sendVerificationEmail(email);

    return res.status(200).json({ success: true });
}

async function checkCode(req: Request, res: Response) {
    //TODO add try and catch
    const { email, verificationCode, connectionType } = req.body;

    const success = await verifyCode(email, verificationCode);

    if (success) {
        if (connectionType?.current === "client") {
            const token = await addClientUser(email);
        } else if (connectionType?.current === "business") {
            const token = await addBusinessUser(email);
        } else {
            return res
                .status(400)
                .json({ success: false, message: " קיימת שגיאה" });
        }
        const token = (await addClientUser(email)) || addBusinessUser(email);
        return res
            .status(200)
            .json({ success: true, token, message: "הקוד אומת בהצלחה" });
    } else {
        return res
            .status(400)
            .json({ success: false, message: "קוד לא תקין או פג תוקף" });
    }
}

async function checkTokenEmail(req: Request, res: Response) {
    const { email, token } = req.body;

    const success = await verifyToken(email, token);

    if (success) {
        return res
            .status(200)
            .json({ success: true, message: "משתמש קיים במערכת" });
    } else {
        return res
            .status(400)
            .json({ success: false, message: "משתמש לא קיים במערכת" });
    }
}
