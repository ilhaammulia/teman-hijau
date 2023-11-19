import Joi from "joi";

const registerUserValidation = Joi.object({
  username: Joi.string().max(20).required(),
  password: Joi.string().max(100).required(),
  role_id: Joi.string().max(10).required(),
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  email: Joi.string().max(100).required(),
}).options({
  allowUnknown: false,
});

const loginUserValidation = Joi.object({
  username: Joi.string().max(20).required(),
  password: Joi.string().max(100).required(),
}).options({
  allowUnknown: false,
});

const withdrawalUserValidation = Joi.object({
  amount: Joi.number().required(),
});

const transactionValidation = Joi.object({
  garbage_id: Joi.number().required(),
  user_id: Joi.string().max(20).required(),
  organization_id: Joi.number().required(),
  qty: Joi.number().required(),
});

export {
  registerUserValidation,
  loginUserValidation,
  withdrawalUserValidation,
  transactionValidation,
};
