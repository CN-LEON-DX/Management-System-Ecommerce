import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import Roles from "../../models/role.model";

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const find = { deleted: false };
    const records = await Roles.find(find);
    res.render("admin/pages/roles/index", {
      pageTitle: "Decentralized",
      records,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const create = (req: Request, res: Response): void => {
  res.render("admin/pages/roles/create", {
    pageTitle: "New roles",
    prefixAdmin: systemConfig.prefixAdmin,
  });
};

export const createRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description } = req.body;
    const newRole = new Roles({
      title,
      description,
    });
    await newRole.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error("Error creating role:", error);
    res.redirect(`${systemConfig.prefixAdmin}/roles/create`);
  }
};

export const edit = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const record = await Roles.findById(id);
    if (!record) {
      res.status(404).send("Role not found");
      return;
    }
    res.render("admin/pages/roles/edit", {
      pageTitle: "Edit roles",
      record,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.error("Error fetching role for edit:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await Roles.updateOne({ _id: id }, req.body);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error("Error updating role:", error);
    res.redirect(`${systemConfig.prefixAdmin}/roles/edit/${id}`);
  }
};

export const permission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const find = { deleted: false };
    const records = await Roles.find(find);
    res.render("admin/pages/roles/permission", {
      pageTitle: "Permission",
      records,
      prefixAdmin: systemConfig.prefixAdmin,
    });
  } catch (error) {
    console.error("Error fetching roles for permissions:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const changePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permissions: { id: string, permissions: string[] }[] = JSON.parse(
      req.body.permissions
    );
    for (const item of permissions) {
      const { id, permissions: perm } = item;
      await Roles.updateOne({ _id: id }, { permissions: perm });
    }
    req.flash("success", "Change permission successfully!");
    res.redirect(`${systemConfig.prefixAdmin}/roles/permission`);
  } catch (error) {
    console.error("Error changing permissions:", error);
    res.status(500).send("Internal Server Error");
  }
};
