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

export default { createCategory, categories };
