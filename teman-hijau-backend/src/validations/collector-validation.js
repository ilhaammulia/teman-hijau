import Joi from "joi";

const collectorValidation = Joi.object({
  name: Joi.string().max(100).required(),
  address: Joi.string().required(),
}).options({
  allowUnknown: false,
});

const transactionValidation = Joi.object({
  garbage_id: Joi.number().required(),
  organization_id: Joi.number().required(),
  collector_id: Joi.number().required(),
  qty: Joi.number().required(),
});

export { collectorValidation, transactionValidation };
