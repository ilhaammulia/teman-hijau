import Joi from "joi";

const updateValidation = Joi.object({
  name: Joi.string().max(100).required(),
  address: Joi.string().required(),
}).options({
  allowUnknown: false,
});

const cashoutValidation = Joi.object({
  description: Joi.string().max(100).required(),
  amount: Joi.number().required(),
}).options({
  allowUnknown: false,
});

export { updateValidation, cashoutValidation };
