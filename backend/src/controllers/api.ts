import { Request, Response } from "express";

async function sendEmailCode(req: Request, res: Response) {
    console.log(req.body)
    return res.status(200).json({ message: "Hello LIT!" });
}

export { sendEmailCode };