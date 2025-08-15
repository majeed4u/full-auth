import { getSession } from "@/lib/getSession";
import type { Session, User } from "better-auth";
import type { Request, Response, NextFunction } from "express";



declare global {
    namespace Express {
        interface Request {
            user?: User;
            session?: Session;
        }
    }
}

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await getSession(req);
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = session.user;
        next();
    } catch (err) {
        console.error("Error in protectedRoute:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export type ProtectedRoute = typeof protectedRoute;