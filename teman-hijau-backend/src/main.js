import { web } from "./applications/web.js";
import { logger } from "./applications/logging.js";
import "dotenv/config";

web.listen(5000, () => {
  logger.info("App start");
});
