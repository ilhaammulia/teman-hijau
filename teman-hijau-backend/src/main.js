import { web } from "./applications/web.js";
import { logger } from "./applications/logging.js";

web.listen(5000, () => {
  logger.info("App start");
});
