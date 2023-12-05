import userService from "../services/user-service.js";

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
    user.profile = profile;
    res.status(200).json({
      data: user,
    });
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
  wallet,
  withdrawal,
  requestWithdrawal,
  createTransaction,
  acceptTransaction,
  rejectTransaction,
  acceptWithdrawal,
};
