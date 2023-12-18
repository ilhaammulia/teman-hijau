import { prismaClient } from "../applications/database.js";
import { validate } from "../validations/validate.js";
import {
  createCategoryValidation,
  createGarbageValidation,
} from "../validations/garbage-validation.js";
import { ResponseError } from "../exceptions/response-error.js";

const createCategory = async (request) => {
  const category = validate(createCategoryValidation, request);
  return prismaClient.category.create({
    data: category,
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });
};

const categories = async () => {
  return prismaClient.category.findMany();
};

const updateCategory = async (categoryId, request) => {
  const data = validate(createCategoryValidation, request);
  const category = await prismaClient.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new ResponseError(404, "Kategori tidak ditemukan.");
  }

  return prismaClient.category.update({
    where: { id: category.id },
    data: data,
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });
};

const deleteCategory = async (categoryId) => {
  const category = await prismaClient.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) throw new ResponseError(404, "Kategori tidak ditemukan.");
  return prismaClient.category.delete({
    where: { id: category.id },
    select: {
      name: true,
    },
  });
};

const createGarbage = async (request) => {
  const garbage = validate(createGarbageValidation, request);
  return prismaClient.garbage.create({
    data: garbage,
    select: {
      name: true,
      unit: true,
      buy_price: true,
      sell_price: true,
      stock: true,
      created_at: true,
      category: true,
    },
  });
};

const garbages = async () => {
  return prismaClient.garbage.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      category: true,
    },
    orderBy: {
      updated_at: "desc",
    },
  });
};

const updateGarbage = async (garbageId, request) => {
  const data = validate(createGarbageValidation, request);
  const garbage = await prismaClient.garbage.findUnique({
    where: { id: garbageId },
  });
  if (!garbage) {
    throw new ResponseError(404, "Sampah tidak ditemukan.");
  }

  return prismaClient.garbage.update({
    where: { id: garbage.id },
    data: data,
    select: {
      name: true,
      unit: true,
      buy_price: true,
      sell_price: true,
      stock: true,
      created_at: true,
      category: true,
    },
  });
};

const deleteGarbage = async (garbageId) => {
  const garbage = await prismaClient.garbage.findUnique({
    where: { id: garbageId },
  });

  if (!garbage) throw new ResponseError(404, "Sampah tidak ditemukan.");
  return prismaClient.garbage.delete({
    where: { id: garbage.id },
    select: {
      name: true,
    },
  });
};

export default {
  createCategory,
  categories,
  updateCategory,
  deleteCategory,
  createGarbage,
  garbages,
  updateGarbage,
  deleteGarbage,
};
