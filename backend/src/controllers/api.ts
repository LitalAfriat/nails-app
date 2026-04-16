import { Request, Response } from "express";
import nodemailer from 'nodemailer';

export { sendEmailCode };

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
    const emailRespond = await transporter.sendMail({
    from: process.env.EMAIL_USER, 
    to: req.body.email ,
    subject: 'Nails App Email Verification Code.',
    html: `<p> ${random6DigitCode()} </p>`,
    
    });

    return res.status(200).json({ message: "Hello LIT!" }); // send info about the success of the email sending, and not just a message
}