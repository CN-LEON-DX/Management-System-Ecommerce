interface IItem {
  id: string;
  parentID: string;
  name: string;
  children?: IItem[];
  index?: number;
}

let count = 0;

const createTree = (arr: IItem[], parentID: string = ""): IItem[] => {
  const tree: IItem[] = [];

  arr.forEach((item) => {
    if (item.parentID === parentID) {
      count++;
      item.index = count;
      const children = createTree(arr, item.id);

      if (children.length) {
        item.children = children;
      }

      tree.push(item);
    }
  });

  return tree;
};

const createTreeHelper = (arr: IItem[]): IItem[] => {
  count = 0; // Reset count before each tree creation
  return createTree(arr);
};

export default createTreeHelper;
