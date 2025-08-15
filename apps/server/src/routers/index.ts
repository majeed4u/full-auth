import userRoutes from "./user.routes";


export const appRouter = {
    users: userRoutes
};
export type AppRouter = typeof appRouter;
