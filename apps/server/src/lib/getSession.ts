import { fromNodeHeaders } from "better-auth/node";
import type { Request } from "express";
import { auth } from "./auth";

export const getSession = async (req: Request) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    })
    return session;
};
