import { prismaClient } from "../applications/database.js";
import { validate } from "../validations/validate.js";
import { collectorValidation } from "../validations/collector-validation.js";
import { ResponseError } from "../exceptions/response-error.js";

const createCollector = async (request) => {
  const collector = validate(collectorValidation, request);

  return prismaClient.collector.create({
    data: collector,
    select: {
      id: true,
      name: true,
      address: true,
    },
  });
};

const collectors = async () => {
  return prismaClient.collector.findMany({
    orderBy: { created_at: "desc" },
  });
};

const updateCollector = async (collectorId, request) => {
  const count = await prismaClient.collector.count({
    where: { id: collectorId },
  });

  if (!count) throw new ResponseError(404, "Data Pengepul tidak ditemukan.");

  const collector = validate(collectorValidation, request);

  return prismaClient.collector.update({
    data: collector,
    where: { id: collectorId },
    select: {
      name: true,
      address: true,
    },
  });
};

const deleteCollector = async (collectorId) => {
  const count = await prismaClient.collector.count({
    where: { id: collectorId },
  });

  if (!count) throw new ResponseError(404, "Data Pengepul tidak ditemukan.");
  return prismaClient.collector.delete({
    where: { id: collectorId },
    select: {
      id: true,
      name: true,
      address: true,
    },
  });
};

export default {
  createCollector,
  collectors,
  updateCollector,
  deleteCollector,
};
