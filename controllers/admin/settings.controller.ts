import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import SettingsGeneral from "../../models/setting-general.model";

export const general = async (req: Request, res: Response): Promise<void> => {
  try {
    const settingGeneral = await SettingsGeneral.findOne({});
    
    console.log(settingGeneral); // For debugging purposes
    res.render("admin/pages/settings/general", {
      pageTitle: "Settings",
      prefixAdmin: systemConfig.prefixAdmin,
      settings: settingGeneral,
    });
  } catch (error) {
    console.error("Error fetching general settings:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const generalPatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const settingGeneral = await SettingsGeneral.findOne({});
    
    if (settingGeneral) {
      // If settings exist, update the record
      await SettingsGeneral.updateOne({ _id: settingGeneral.id }, req.body);
    } else {
      // If settings do not exist, create a new record
      const record = new SettingsGeneral(req.body);
      await record.save();
    }

    req.flash("success", "Update successfully!");
    res.redirect("back");
  } catch (error) {
    console.error("Error updating general settings:", error);
    res.status(500).send("Internal Server Error");
  }
};
