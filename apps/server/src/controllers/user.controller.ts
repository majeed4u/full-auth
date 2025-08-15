import express from 'express';
import type { Response, Request } from 'express';
import db from '../../prisma';
export const userController = {
    getUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await db.user.findUnique({
                where: { id }
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    getUsers: async (req: Request, res: Response) => {
        try {
            const users = await db.user.findMany();
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    createUser: (req: Request, res: Response) => {
        res.json({ message: 'Create user' });
    },
    updateUser: (req: Request, res: Response) => {
        const { id } = req.params;
        res.json({ message: `Update user with ID: ${id}` });
    },
    deleteUser: (req: Request, res: Response) => {
        const { id } = req.params;
        res.json({ message: `Delete user with ID: ${id}` });
    }
};
export type userController = typeof userController;

