import { prismaClient } from "../applications/database.js";
import { validate } from "../validations/validate.js";
import { generateRandomId } from "../utils/generate-random.js";
import {
  collectorValidation,
  transactionValidation,
} from "../validations/collector-validation.js";
import { ResponseError } from "../exceptions/response-error.js";

const createCollector = async (request) => {
  const collector = validate(collectorValidation, request);

  return prismaClient.collector.create({
    data: collector,
    select: {
      id: true,
      name: true,
      address: true,
      created_at: true,
      updated_at: true,
    },
  });
};

const collectors = async () => {
  return prismaClient.collector.findMany({
    where: {
      deleted_at: null,
    },
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
      id: true,
      name: true,
      address: true,
      created_at: true,
      updated_at: true,
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

const createTransaction = async (user, request) => {
  const data = validate(transactionValidation, request);
  const id = generateRandomId("ORD");

  const garbage = await prismaClient.garbage.findUnique({
    where: { id: data.garbage_id, deleted_at: null },
  });

  if (!garbage) throw new ResponseError(404, "Data sampah tidak ditemukan.");

  if (garbage.stock < data.qty)
    throw new ResponseError(400, "Stok sampah tidak memenuhi.");

  await prismaClient.garbage.update({
    where: { id: garbage.id },
    data: {
      stock: { decrement: data.qty },
    },
  });

  data.id = id;
  data.staff_id = user.username;
  data.total_price = garbage.sell_price * data.qty;

  return prismaClient.collectorTransaction.create({
    data: data,
    include: {
      collector: true,
      garbage: true,
      staff: true,
    },
  });
};

const acceptTransaction = async (transactionId) => {
  const transaction = await prismaClient.collectorTransaction.findUnique({
    where: { id: transactionId, status: "PENDING" },
  });

  if (!transaction)
    throw new ResponseError(404, "Data transaksi tidak ditemukan.");

  const organization = await prismaClient.organization.findFirst();

  const [currentTransaction, updateBalance] = await prismaClient.$transaction([
    prismaClient.collectorTransaction.update({
      data: {
        status: "ACCEPTED",
      },
      where: { id: transaction.id },
    }),
    prismaClient.organization.update({
      data: {
        balance: { increment: transaction.total_price },
      },
      where: { id: organization.id },
    }),
  ]);

  return currentTransaction;
};

const rejectTransaction = async (transactionId) => {
  const transaction = await prismaClient.collectorTransaction.findUnique({
    where: { id: transactionId, status: "PENDING" },
  });

  if (!transaction)
    throw new ResponseError(404, "Data transaksi tidak ditemukan.");

  const [currentTransaction, updatedGarbage] = await prismaClient.$transaction([
    prismaClient.collectorTransaction.update({
      data: {
        status: "ACCEPTED",
      },
      where: { id: transactionId },
    }),
    prismaClient.garbage.update({
      data: {
        stock: { increment: transaction.qty },
      },
      where: { id: transaction.garbage_id },
    }),
  ]);

  return currentTransaction;
};

export default {
  createCollector,
  collectors,
  updateCollector,
  deleteCollector,
  createTransaction,
  acceptTransaction,
  rejectTransaction,
};
