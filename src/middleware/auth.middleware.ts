import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ message: "No token" });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "No token" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string;
            email: string;
        }

        req.user = decoded;

        next();

    } catch(err) {
        console.log(err);
        res.status(401).json({ message: "Invalid or expired token"})
    }
}