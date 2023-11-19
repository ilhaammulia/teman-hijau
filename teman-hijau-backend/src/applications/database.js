import { PrismaClient } from "@prisma/client";
import { logger } from "./logging.js";

let prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prismaClient.$on("error", (e) => {
  logger.error(e);
});

prismaClient.$on("warn", (e) => {
  logger.warn(e);
});

prismaClient.$on("info", (e) => {
  logger.info(e);
});

prismaClient.$on("query", (e) => {
  logger.info(e);
});

prismaClient = prismaClient.$extends({
  name: "SoftDelete",
  model: {
    $allModels: {
      async delete({ where, select }) {
        const result = await this.update({
          data: { deleted_at: new Date() },
          where,
          select,
        });
        return result;
      },
    },
  },
});

export { prismaClient };
