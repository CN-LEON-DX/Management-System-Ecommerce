import { Request, Response } from "express";

export const dashboard = (req: Request, res: Response): void => {
  res.render("admin/pages/dashboard/index", {
    pageTitle: "Dashboard",
  });
};
