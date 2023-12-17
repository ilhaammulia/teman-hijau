import express from "express";
import { errorMiddleware } from "../middlewares/error-middleware.js";
import { publicRouter } from "../routes/public-api.js";
import { privateRouter } from "../routes/private-api.js";

import cors from "cors";

export const web = express();
web.use(cors());
web.use(express.json());

web.use(publicRouter);
web.use(privateRouter);

web.use(errorMiddleware);
