import jwt from "jsonwebtoken";
import {User} from "../models/user.js";
export const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log();
        const decoded = jwt.verify(token,"p");
        req.user = await User.findById(decoded.id);
        next();
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}