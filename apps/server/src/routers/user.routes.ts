import { userController } from '@/controllers/user.controller';
import express from 'express';
const router = express.Router();


router.get("/users", userController.getUsers)
router.get("/users/:id", userController.getUser);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

export default router;

export type userRoutes = typeof router;