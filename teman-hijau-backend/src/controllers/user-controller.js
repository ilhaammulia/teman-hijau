import userService from "../services/user-service.js";
import { ResponseError } from "../exceptions/response-error.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    delete result.refresh_token;
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const fetch = async (req, res, next) => {
  try {
    const user = req.user;
    const profile = await userService.fetch(user);
    res.status(200).json({
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const roles = async (req, res, next) => {
  try {
    const roles = await userService.roles();
    res.status(200).json({
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

const fetchAll = async (req, res, next) => {
  try {
    const users = await userService.fetchAll();
    res.status(200).json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const updated = await userService.update(user, req.body);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
};

const updateByUsername = async (req, res, next) => {
  try {
    const username = req.params.id;
    const updated = await userService.updateByUsername(username, req.body);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const username = req.params.id;
    if (!username) throw new ResponseError(400, "Masukan ID pengguna.");
    const status = userService.deleteUser(username);
    res.status(200).json({ data: status });
  } catch (error) {
    next(error);
  }
};

const wallet = async (req, res, next) => {
  try {
    const walletDetails = await userService.wallet(req.user);
    res.status(200).json({
      data: walletDetails,
    });
  } catch (error) {
    next(error);
  }
};

const withdrawal = async (req, res, next) => {
  try {
    const userWithdrawal = await userService.withdrawal(req.user);
    res.status(200).json({ data: userWithdrawal });
  } catch (error) {
    next(error);
  }
};

const allWithdrawals = async (req, res, next) => {
  try {
    const usersWithdrawal = await userService.allWithdrawals(req.user);
    res.status(200).json({ data: usersWithdrawal });
  } catch (error) {
    next(error);
  }
};

const requestWithdrawal = async (req, res, next) => {
  try {
    const withdraw = await userService.requestWithdrawal(req.user, req.body);
    res.status(200).json({ data: withdraw });
  } catch (error) {
    next(error);
  }
};

const acceptWithdrawal = async (req, res, next) => {
  try {
    const withdraw = await userService.acceptWithdrawal(
      req.user,
      req.params.id
    );
    res.status(200).json({ data: withdraw });
  } catch (error) {
    next(error);
  }
};

const rejectWithdrawal = async (req, res, next) => {
  try {
    const withdraw = await userService.rejectWithdrawal(
      req.user,
      req.params.id
    );
    res.status(200).json({ data: withdraw });
  } catch (error) {
    next(error);
  }
};

const allTransactions = async (req, res, next) => {
  try {
    const transactions = await userService.allTransactions();
    res.status(200).json({ data: transactions });
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const transaction = await userService.createTransaction(req.user, req.body);
    res.status(201).json({ data: transaction });
  } catch (error) {
    next(error);
  }
};

const acceptTransaction = async (req, res, next) => {
  try {
    const updated = await userService.acceptTransaction(req.params.id);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
};

const rejectTransaction = async (req, res, next) => {
  try {
    const updated = await userService.rejectTransaction(req.params.id);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
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
  allTransactions,
  createTransaction,
  acceptTransaction,
  rejectTransaction,
  acceptWithdrawal,
  rejectWithdrawal,
};
