import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../exceptions/response-error.js";
import { validate } from "../validations/validate.js";
import {
  registerUserValidation,
  loginUserValidation,
  withdrawalUserValidation,
} from "../validations/user-validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRandomId } from "../utils/generate-random.js";

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

export default {
  register,
  login,
  fetch,
  wallet,
  withdrawal,
  requestWithdrawal,
};
