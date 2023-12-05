import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../exceptions/response-error.js";
import { validate } from "../validations/validate.js";
import {
  registerUserValidation,
  loginUserValidation,
  withdrawalUserValidation,
  transactionValidation,
} from "../validations/user-validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRandomId } from "../utils/generate-random.js";
import { logger } from "../applications/logging.js";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      OR: [{ username: user.username }, { email: user.email }],
    },
  });

  if (countUser) {
    throw new ResponseError(400, "Username telah digunakan.");
  }

  user.password = await bcrypt.hash(user.password, 10);

  await prismaClient.user.create({
    data: {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      profile_photo: "",
    },
  });

  await prismaClient.wallet.create({
    data: {
      username: user.username,
    },
  });

  return prismaClient.authentication.create({
    data: {
      username: user.username,
      password: user.password,
      role_id: user.role_id,
    },
    select: {
      username: true,
      role_id: true,
    },
  });
};

const login = async (request) => {
  const loginUser = validate(loginUserValidation, request);

  const user = await prismaClient.authentication.findUnique({
    where: {
      username: loginUser.username,
    },
    include: {
      role: true,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    loginUser.password,
    user.password
  );

  if (!user || !isPasswordMatched) {
    throw new ResponseError(401, "Username atau Password salah.");
  }
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });

  const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  const updatedUser = await prismaClient.authentication.update({
    where: { username: user.username },
    data: { refresh_token: refreshToken },
    select: {
      username: true,
      role_id: true,
      refresh_token: true,
    },
  });

  return { ...updatedUser, access_token: accessToken };
};

const fetch = async (user) => {
  return prismaClient.user.findUnique({
    where: {
      username: user.username,
    },
  });
};

const wallet = async (user) => {
  return prismaClient.wallet.findUnique({
    where: {
      username: user.username,
    },
  });
};

const withdrawal = async (user) => {
  return prismaClient.userWithdrawal.findMany({
    where: { user_id: user.username },
    orderBy: { created_at: "desc" },
  });
};

const requestWithdrawal = async (user, request) => {
  const data = validate(withdrawalUserValidation, request);
  const id = generateRandomId("WD");

  const wallet = await prismaClient.wallet.findUnique({
    where: { username: user.username },
  });

  if (wallet.balance < data.amount) {
    throw new ResponseError(400, "Saldo anda tidak mencukupi.");
  }

  return prismaClient.userWithdrawal.create({
    data: {
      id: id,
      user_id: user.username,
      amount: data.amount,
    },
    select: {
      user_id: true,
      amount: true,
      created_at: true,
    },
  });
};

const acceptWithdrawal = async (user, withdrawId) => {
  const withdraw = await prismaClient.userWithdrawal.findUnique({
    where: { id: withdrawId },
  });

  if (!withdraw)
    throw new ResponseError(404, "Data penarikan tidak ditemukan.");

  const [currentWithdraw, updatedWallet] = await prismaClient.$transaction([
    prismaClient.userWithdrawal.update({
      data: {
        status: "ACCEPTED",
        staff_id: user.id,
      },
      where: { id: withdrawId },
    }),
    prismaClient.wallet.update({
      data: {
        balance: { decrement: withdraw.amount },
      },
      where: { username: withdraw.user_id },
    }),
  ]);

  return currentWithdraw;
};

const rejectWithdrawal = async (user, withdrawId) => {
  const withdraw = await prismaClient.userWithdrawal.findUnique({
    where: { id: withdrawId },
  });

  if (!withdraw)
    throw new ResponseError(404, "Data penarikan tidak ditemukan.");

  const currentWithdraw = await prismaClient.userWithdrawal.update({
    data: {
      status: "REJECTED",
      staff_id: user.id,
    },
    where: { id: withdrawId },
  });

  return currentWithdraw;
};

const createTransaction = async (user, request) => {
  const data = validate(transactionValidation, request);
  const id = generateRandomId("INV");

  const garbage = await prismaClient.garbage.findUnique({
    where: { id: data.garbage_id, deleted_at: null },
  });

  if (!garbage) throw new ResponseError(404, "Data sampah tidak ditemukan.");

  data.id = id;
  data.staff_id = user.id;
  data.total_price = garbage.buy_price * data.qty;

  garbage.stock = garbage.stock + data.qty;

  await prismaClient.garbage.update({
    data: garbage,
    where: { id: garbage.id },
  });

  return prismaClient.userTransaction.create({
    data: data,
  });
};

const acceptTransaction = async (transactionId) => {
  const transaction = await prismaClient.userTransaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction)
    throw new ResponseError(404, "Data transaksi tidak ditemukan.");

  const [currentTransaction, updatedWallet] = await prismaClient.$transaction([
    prismaClient.userTransaction.update({
      data: {
        status: "ACCEPTED",
      },
      where: { id: transactionId },
    }),
    prismaClient.wallet.update({
      data: {
        balance: { increment: transaction.total_price },
      },
      where: { username: transaction.user_id },
    }),
  ]);

  return currentTransaction;
};

const rejectTransaction = async (transactionId) => {
  const transaction = await prismaClient.userTransaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction)
    throw new ResponseError(404, "Data transaksi tidak ditemukan.");

  const currentTransaction = await prismaClient.userTransaction.update({
    data: {
      status: "REJECTED",
    },
    where: { id: transactionId },
  });

  return currentTransaction;
};

export default {
  register,
  login,
  fetch,
  wallet,
  withdrawal,
  requestWithdrawal,
  acceptWithdrawal,
  rejectWithdrawal,
  createTransaction,
  acceptTransaction,
  rejectTransaction,
};
