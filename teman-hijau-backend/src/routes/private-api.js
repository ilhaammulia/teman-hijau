import express from "express";
import { verifyAuthMiddleware } from "../middlewares/verify-auth-middleware.js";
import { staffOnlyMiddleware } from "../middlewares/staff-only-middleware.js";
import userController from "../controllers/user-controller.js";
import garbageController from "../controllers/garbage-controller.js";

const privateRouter = new express.Router();
privateRouter.use(verifyAuthMiddleware);

privateRouter.get("/api/users", userController.fetch);
privateRouter.get("/api/users/wallet", userController.wallet);
privateRouter.get("/api/users/withdrawals", userController.withdrawal);
privateRouter.post("/api/users/withdrawals", userController.requestWithdrawal);

privateRouter.use("/api/garbages", staffOnlyMiddleware);

privateRouter.post("/api/garbages", garbageController.createGarbage);
privateRouter.get("/api/garbages", garbageController.garbages);
privateRouter.put("/api/garbages/:id", garbageController.updateGarbage);
privateRouter.delete("/api/garbages/:id", garbageController.deleteGarbage);

privateRouter.post(
  "/api/garbages/categories",
  garbageController.createCategory
);
privateRouter.get("/api/garbages/categories", garbageController.categories);
privateRouter.put(
  "/api/garbages/categories/:id",
  garbageController.updateCategory
);
privateRouter.delete(
  "/api/garbages/categories/:id",
  garbageController.deleteCategory
);
export { privateRouter };
