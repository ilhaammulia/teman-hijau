import { ResponseError } from "../exceptions/response-error.js";
import organizationService from "../services/organization-service.js";

const fetch = async (req, res, next) => {
  try {
    const organization = await organizationService.fetch();
    res.status(200).json({ data: organization });
  } catch (error) {
    next(error);
  }
};

const createCashout = async (req, res, next) => {
  try {
    const cashout = await organizationService.createCashout(req.body);
    res.status(201).json({ data: cashout });
  } catch (error) {
    next(error);
  }
};

const cashouts = async (req, res, next) => {
  try {
    const data = await organizationService.cashouts();
    res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.id);
    const updated = await organizationService.update(organizationId, req.body);
    res.status(200).json({ data: updated });
  } catch (error) {
    next(error);
  }
};

export default { fetch, createCashout, cashouts, update };
