import { ResponseError } from "../exceptions/response-error";
import garbageService from "../services/garbage-service";

const createCategory = async (req, res, next) => {
  try {
    const category = await garbageService.createCategory(req.body);
    res.status(201).json({ data: category });
  } catch (error) {
    next(error);
  }
};

const categories = async (req, res, next) => {
  try {
    const categoryList = await garbageService.categories();
    res.status(200).json({ data: categoryList });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    if (!categoryId) {
      throw new ResponseError(400, "Masukan ID kategori.");
    }
    const category = await garbageService.updateCategory(categoryId, req.body);
    res.status(200).json({ data: category });
  } catch (error) {
    next(error);
  }
};

const createGarbage = async (req, res, next) => {
  try {
    const garbage = await garbageService.createGarbage(req.body);
    res.status(201).json({ data: garbage });
  } catch (error) {
    next(error);
  }
};

const garbages = async (req, res, next) => {
  try {
    const garbageList = await garbageService.garbages();
    res.status(200).json({ data: garbageList });
  } catch (error) {
    next(error);
  }
};

const updateGarbage = async (req, res, next) => {
  try {
    const garbageId = Number(req.params.id);
    if (!garbageId) {
      throw new ResponseError(400, "Masukan ID sampah.");
    }
    const garbage = await garbageService.updateGarbage(garbageId, req.body);
    res.status(200).json({ data: garbage });
  } catch (error) {
    next(error);
  }
};

const deleteGarbage = async (req, res, next) => {
  try {
    const garbageId = Number(req.params.id);
    if (!garbageId) throw new ResponseError(400, "Masukan ID sampah.");
    const garbage = await garbageService.deleteGarbage(garbageId);
    res.status(200).json({ data: garbage });
  } catch (error) {
    next(error);
  }
};

export default {
  createCategory,
  categories,
  updateCategory,
  createGarbage,
  garbages,
  updateGarbage,
  deleteGarbage,
};
