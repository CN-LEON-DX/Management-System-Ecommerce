import Category from "../models/category.model";
import ICategory from "../models/category.model";

interface ICategoryData {
  title: any;
  slug: any;
  _id: any;
  id: string;
  parentID: string;
  status: string;
  deleted: boolean;
}

const getSubCategory = async (
  parentID: string
): Promise<ICategory[]> => {
  const getCategories = async (parentID: string): Promise<ICategory[]> => {
    const subs: ICategoryData[] = await Category.find({
      parentID,
      status: "active",
      deleted: false,
    });

    let allSub: ICategory[] = subs.map(sub => new Category({
      id: sub.id,
      parentID: sub.parentID,
      status: sub.status,
      deleted: sub.deleted,
      title: sub.title,
      slug: sub.slug,
      _id: sub._id,
    }));

    for (const sub of subs) {
      const subSubs = await getCategories(sub.id); 
      allSub = allSub.concat(subSubs);
    }

    return allSub;
  };

  const result = await getCategories(parentID);
  return result;
};

export {
  getSubCategory,
};