import express from "express";
import { verifyAuthMiddleware } from "../middlewares/verify-auth-middleware.js";
import {
  staffOnlyMiddleware,
  adminOnlyMiddleware,
} from "../middlewares/staff-only-middleware.js";
import userController from "../controllers/user-controller.js";
import garbageController from "../controllers/garbage-controller.js";
import collectorController from "../controllers/collector-controller.js";

const privateRouter = new express.Router();
privateRouter.use(verifyAuthMiddleware);

privateRouter.get("/api/users", userController.fetch);
privateRouter.get("/api/users/wallet", userController.wallet);
privateRouter.get("/api/users/withdrawals", userController.withdrawal);
privateRouter.post("/api/users/withdrawals", userController.requestWithdrawal);
privateRouter.get(
  "/api/users/withdrawals/:id",
  staffOnlyMiddleware,
  userController.acceptWithdrawal
);

privateRouter.post(
  "/api/users/transactions",
  staffOnlyMiddleware,
  userController.createTransaction
);
privateRouter.get(
  "/api/users/transactions/:id/accept",
  adminOnlyMiddleware,
  userController.acceptTransaction
);

privateRouter.get(
  "/api/users/transactions/:id/reject",
  adminOnlyMiddleware,
  userController.rejectTransaction
);

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

privateRouter.use("/api/collectors", staffOnlyMiddleware);

privateRouter.post("/api/collectors", collectorController.createCollector);
privateRouter.get("/api/collectors", collectorController.collectors);
privateRouter.put("/api/collectors/:id", collectorController.updateCollector);
privateRouter.delete(
  "/api/collectors/:id",
  collectorController.deleteCollector
);

export { privateRouter };
