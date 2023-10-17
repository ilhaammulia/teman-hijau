import { prismaClient } from "../applications/database.js";
import { validate } from "../validations/validate.js";
import { createCategoryValidation } from "../validations/garbage-validation.js";

const createCategory = async (request) => {
  const category = validate(createCategoryValidation, request);
  return prismaClient.category.create({
    data: {
      name: category.name,
    },
    select: {
      id: true,
      name: true,
    },
  });
};

const categories = async () => {
  return prismaClient.category.findMany();
};

export default { createCategory, categories };
