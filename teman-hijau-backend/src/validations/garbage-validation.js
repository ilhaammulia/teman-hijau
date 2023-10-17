import Joi from "joi";

const createCategoryValidation = Joi.object({
  name: Joi.string().max(100).required(),
});

export { createCategoryValidation };
