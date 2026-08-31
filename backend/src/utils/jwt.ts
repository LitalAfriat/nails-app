import jwt from "jsonwebtoken";

export { generateJWToken };

const generateJWToken = async (email: string, uid: string) => {
    const token = jwt.sign(
        { userId: uid, email: email },
        process.env.JWT_SECRET!,
        { expiresIn: "120d" },
    );
    return token;
};
