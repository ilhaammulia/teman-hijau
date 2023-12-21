import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../exceptions/response-error.js";
import { validate } from "../validations/validate.js";
import {
  registerUserValidation,
  loginUserValidation,
  withdrawalUserValidation,
  transactionValidation,
  updateUservalidation,
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
    throw new ResponseError(400, "Username atau Email telah digunakan.");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const photos = [
    "https://cdn-icons-png.flaticon.com/512/5640/5640467.png",
    "https://cdn-icons-png.flaticon.com/512/3940/3940403.png",
    "https://cdn-icons-png.flaticon.com/512/9007/9007291.png",
    "https://cdn-icons-png.flaticon.com/512/13370/13370631.png",
    "https://cdn-icons-png.flaticon.com/512/12931/12931705.png",
  ];

  await prismaClient.user.create({
    data: {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      profile_photo: photos[Math.floor(Math.random() * photos.length)],
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
    include: {
      role: true,
    },
  });
};

const login = async (request) => {
  const loginUser = validate(loginUserValidation, request);

  const user = await prismaClient.authentication.findUnique({
    where: {
      username: loginUser.username,
    },
    select: {
      username: true,
      password: true,
      role_id: true,
      role: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username atau Password salah.");
  }

  const isPasswordMatched = await bcrypt.compare(
    loginUser.password,
    user.password
  );

  if (!isPasswordMatched) {
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
    include: {
      role: true,
    },
  });

  return { ...updatedUser, access_token: accessToken };
};

const update = async (user, req) => {
  const data = validate(updateUservalidation, req);

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
    await prismaClient.authentication.update({
      where: { username: user.username },
      data: {
        password: data.password,
      },
    });
  }

  delete data.password;

  return prismaClient.user.update({
    where: { username: user.username },
    data: data,
  });
};

const updateByUsername = async (username, req) => {
  const data = validate(updateUservalidation, req);

  const authBody = {};
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
    authBody.password = data.password;
  }
  if (data.role_id) {
    authBody.role_id = data.role_id;
  }

  if (authBody) {
    await prismaClient.authentication.update({
      where: { username: username },
      data: authBody,
    });

    delete data.password;
    delete data.role_id;
  }

  return prismaClient.user.update({
    where: { username: username },
    data: data,
  });
};

const deleteUser = async (username) => {
  await prismaClient.authentication.delete({ where: { username: username } });
  await prismaClient.wallet.delete({ where: { username: username } });
  await prismaClient.user.delete({ where: { username: username } });

  return { status: "success" };
};

const fetchAll = async () => {
  const auth = await prismaClient.authentication.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
    select: {
      username: true,
      role: true,
    },
  });

  const result = await Promise.all(
    auth.map(async (user) => {
      const profile = await prismaClient.user.findUnique({
        where: { username: user.username },
        select: {
          first_name: true,
          last_name: true,
          phone: true,
          email: true,
        },
      });
      return {
        ...user,
        ...profile,
      };
    })
  );

  return result;
};

const roles = async (user) => {
  return prismaClient.role.findMany();
};

const fetch = async (user) => {
  const fetched = await prismaClient.user.findUnique({
    where: {
      username: user.username,
    },
    include: {
      UserTransaction: {
        include: {
          garbage: true,
          staff: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });
  const pendingBalance = fetched.UserTransaction.reduce((prev, curr) => {
    if (curr.status == "PENDING") {
      return (prev += parseFloat(curr.total_price));
    }
  }, 0);

  return {
    first_name: fetched.first_name,
    last_name: fetched.last_name,
    email: fetched.email,
    address: fetched.address,
    phone: fetched.phone,
    profile_photo: fetched.profile_photo,
    transactions: fetched.UserTransaction,
    pending_balance: {
      balance: pendingBalance ?? 0,
      updated_at: null,
    },
  };
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
    include: {
      staff: true,
    },
    orderBy: { created_at: "desc" },
  });
};

const allWithdrawals = async () => {
  return prismaClient.userWithdrawal.findMany({
    orderBy: { created_at: "desc" },
    include: {
      user: true,
      staff: true,
    },
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

  await prismaClient.wallet.update({
    data: {
      balance: { decrement: data.amount },
    },
    where: { username: user.username },
  });

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
    where: { id: withdrawId, status: "PENDING" },
  });

  if (!withdraw)
    throw new ResponseError(404, "Data penarikan tidak ditemukan.");

  const currentWithdraw = await prismaClient.userWithdrawal.update({
    data: {
      status: "ACCEPTED",
      staff_id: user.username,
    },
    where: { id: withdrawId },
    include: {
      staff: true,
    },
  });

  return currentWithdraw;
};

const rejectWithdrawal = async (user, withdrawId) => {
  const withdraw = await prismaClient.userWithdrawal.findUnique({
    where: { id: withdrawId, status: "PENDING" },
  });

  if (!withdraw)
    throw new ResponseError(404, "Data penarikan tidak ditemukan.");

  await prismaClient.wallet.update({
    data: {
      balance: { increment: withdraw.amount },
    },
    where: { username: withdraw.user_id },
  });

  const currentWithdraw = await prismaClient.userWithdrawal.update({
    data: {
      status: "REJECTED",
      staff_id: user.username,
    },
    where: { id: withdrawId },
    include: {
      staff: true,
    },
  });

  return currentWithdraw;
};

const allTransactions = async () => {
  const getUserTransactionsWithType = async () => {
    const userTransactions = await prismaClient.userTransaction.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        garbage: true,
        user: true,
        staff: true,
      },
    });
    return userTransactions.map((transaction) => ({
      ...transaction,
      type: "user",
    }));
  };

  const getCollectorTransactionsWithType = async () => {
    const collectorTransactions =
      await prismaClient.collectorTransaction.findMany({
        orderBy: {
          created_at: "desc",
        },
        include: {
          garbage: true,
          collector: true,
          staff: true,
        },
      });
    return collectorTransactions.map((transaction) => ({
      ...transaction,
      type: "collector",
    }));
  };

  const [userTransactionsWithType, collectorTransactionsWithType] =
    await Promise.all([
      getUserTransactionsWithType(),
      getCollectorTransactionsWithType(),
    ]);

  const transactions = [
    ...userTransactionsWithType,
    ...collectorTransactionsWithType,
  ].sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
  const userTx = await prismaClient.userTransaction.aggregate({
    where: {
      status: "ACCEPTED",
    },
    _sum: {
      total_price: true,
    },
  });

  const collectorTx = await prismaClient.collectorTransaction.aggregate({
    where: {
      status: "ACCEPTED",
    },
    _sum: {
      total_price: true,
    },
  });

  return {
    revenue:
      (collectorTx._sum.total_price ?? 0) - (userTx._sum.total_price ?? 0),
    transactions: transactions,
  };
};

const createTransaction = async (user, request) => {
  const data = validate(transactionValidation, request);
  const id = generateRandomId("INV");

  const garbage = await prismaClient.garbage.findUnique({
    where: { id: data.garbage_id, deleted_at: null },
  });

  if (!garbage) throw new ResponseError(404, "Data sampah tidak ditemukan.");

  data.id = id;
  data.staff_id = user.username;
  data.total_price = garbage.buy_price * data.qty;

  return prismaClient.userTransaction.create({
    data: data,
    include: {
      garbage: true,
      user: true,
      staff: true,
    },
  });
};

const acceptTransaction = async (transactionId) => {
  const transaction = await prismaClient.userTransaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction)
    throw new ResponseError(404, "Data transaksi tidak ditemukan.");

  const organization = await prismaClient.organization.findFirst();

  const [
    currentTransaction,
    updatedWallet,
    updatedGarbage,
    updateOrganization,
  ] = await prismaClient.$transaction([
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
    prismaClient.garbage.update({
      data: {
        stock: { increment: transaction.qty },
      },
      where: { id: transaction.garbage_id },
    }),
    prismaClient.organization.update({
      where: { id: organization.id },
      data: {
        balance: { decrement: transaction.total_price },
      },
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
  roles,
  fetchAll,
  update,
  updateByUsername,
  deleteUser,
  wallet,
  withdrawal,
  allWithdrawals,
  requestWithdrawal,
  acceptWithdrawal,
  rejectWithdrawal,
  allTransactions,
  createTransaction,
  acceptTransaction,
  rejectTransaction,
};
