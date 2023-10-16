import express from "express";
import { verifyAuthMiddleware } from "../middlewares/verify-auth-middleware.js";
import userController from "../controllers/user-controller.js";

const privateRouter = new express.Router();
privateRouter.use(verifyAuthMiddleware);

privateRouter.get("/api/users", userController.fetch);
privateRouter.get("/api/users/wallet", userController.wallet);
privateRouter.get("/api/users/withdrawals", userController.withdrawal);
privateRouter.post("/api/users/withdrawals", userController.requestWithdrawal);

export { privateRouter };
