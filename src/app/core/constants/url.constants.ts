export const API = {
  LOGIN: '/api/v1/auth/login',
  SIGNUP: '/api/v1/auth/signup',
  LOGOUT: '/api/v1/auth/logout',
  GET_USER_INVENTORY: '/api/v1/inventory',
  CREATE_INVENTORY: '/api/v1/inventory/create',
  UPDATE_INVENTORY: '/api/v1/inventory/update/:inventoryId',
  GET_INVENTORY_DETAIL: '/api/v1/inventory/:inventoryId',
  UPLOAD_INVENTORY_IMAGE: '/api/v1/inventory/upload',
  GET_INVENTORY_IMAGE: '/api/v1/inventory/image/:inventoryImageId',
};

export const Routes = {
  LOGIN: 'login',
  INVENTORY: 'inventory',
  STORE: 'store',
  TRANSACTION: 'transaction',
};
