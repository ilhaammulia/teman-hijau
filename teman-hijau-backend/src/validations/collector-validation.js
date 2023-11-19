import Joi from "joi";

const collectorValidation = Joi.object({
  name: Joi.string().max(100).required(),
  address: Joi.string().required(),
}).options({
  allowUnknown: false,
});

export { collectorValidation };
