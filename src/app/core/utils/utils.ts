import { API, CategoryMenuData, Param } from '@app/core';

export const transformName = (fullName: string) => {
  let names = fullName.split(' ');
  let firstName =
    names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase();
  let lastName =
    names[1].charAt(0).toUpperCase() + names[1].slice(1).toLowerCase();
  let transformedName = `${lastName}, ${firstName}`;
  return transformedName;
};

export const getUrl = (baseURL: string, params: Param): string => {
  let modifiedURL: string = baseURL;

  Object.keys(params).forEach((key: string) => {
    modifiedURL = modifiedURL.replace(`:${key}`, params[key].toString());
  });

  return modifiedURL;
};

export const getInventoryImageUrl = (inventoryImageId: string) =>
  getUrl(API.GET_INVENTORY_IMAGE, {
    inventoryImageId: inventoryImageId || 'default',
  });

export const getCategoryNameById = (categoryId: string) => {
  const category = CategoryMenuData.find((cat) => cat.value === categoryId);
  return category ? category.viewValue : 'Category not found';
};

export const getCategoryIdByName = (categoryName: string) => {
  const category = CategoryMenuData.find(
    (cat) => cat.viewValue.toLowerCase() === categoryName.toLowerCase(),
  );
  return category ? category.value : 'Category not found';
};
