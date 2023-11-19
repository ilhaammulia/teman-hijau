import { ResponseError } from "../exceptions/response-error";
import collectorService from "../services/collector-service";

const createCollector = async (req, res, next) => {
  try {
    const collector = await collectorService.createCollector(req.body);
    res.status(201).json({ data: collector });
  } catch (error) {
    next(error);
  }
};

const collectors = async (req, res, next) => {
  try {
    const data = await collectorService.collectors();
    if (!data) throw new ResponseError(404, "Data Pengepul tidak ditemukan.");
    res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
};

const updateCollector = async (req, res, next) => {
  try {
    const collectorId = Number(req.params.id);
    if (!collectorId) throw new ResponseError(400, "Masukan ID Pengepul.");
    const collector = await collectorService.updateCollector(
      collectorId,
      req.body
    );
    res.status(200).json({ data: collector });
  } catch (error) {
    next(error);
  }
};

const deleteCollector = async (req, res, next) => {
  try {
    const collectorId = Number(req.params.id);
    if (!collectorId) throw new ResponseError(404, "Masukan ID Pengepul.");
    const collector = collectorService.deleteCollector(collectorId);
    res.status(200).json({ data: collector });
  } catch (error) {
    next(error);
  }
};

export default {
  createCollector,
  collectors,
  updateCollector,
  deleteCollector,
};
