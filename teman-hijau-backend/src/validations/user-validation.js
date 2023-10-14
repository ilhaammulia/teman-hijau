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

export default { registerUserValidation };
