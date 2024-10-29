import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("Token:", token);

    if (!token) {
        return res.status(401).send("You are not authenticated");
    }

    jwt.verify(token, process.env.JWT_KEY, (error, payload) => {
        if (error) {
            return res.status(403).send("Token is not valid");
        }
        req.userId = payload.userId;
        console.log("Payload:", payload);
        console.log("req.userId",req.userId);
        next();
    });
};
