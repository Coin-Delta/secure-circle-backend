import { Router } from "express";
import userRouter from "./user.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/auth/", authRoutes);
router.use("/users/", userRouter);

export default router;
