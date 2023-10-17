import Joi from "joi";

const createCategoryValidation = Joi.object({
  name: Joi.string().max(100).required(),
});

const createGarbageValidation = Joi.object({
  name: Joi.string().max(100).required(),
  category_id: Joi.number().required(),
  unit: Joi.string().max(100).optional(),
  buy_price: Joi.number().required(),
  sell_price: Joi.number().required(),
  stock: Joi.number().required(),
}).options({
  allowUnknown: false,
});

export { createCategoryValidation, createGarbageValidation };
