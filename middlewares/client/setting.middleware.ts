import { Request, Response, NextFunction } from "express";
import SettingsGeneral from "../../models/setting-general.model";

const settingMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settingGeneral = await SettingsGeneral.findOne({});
    res.locals.settingGeneral = settingGeneral;
    next();
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
};

export default settingMiddleware