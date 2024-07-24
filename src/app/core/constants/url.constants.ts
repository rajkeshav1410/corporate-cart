export const API = {
  LOGIN: '/api/v1/auth/login',
  SIGNUP: '/api/v1/auth/signup',
  LOGOUT: '/api/v1/auth/logout',
  PROFILE: 'api/v1/auth/me',
  GET_USER_INVENTORY: '/api/v1/inventory',
  CREATE_INVENTORY: '/api/v1/inventory/create',
  UPDATE_INVENTORY: '/api/v1/inventory/update/:inventoryId',
  GET_INVENTORY_DETAIL: '/api/v1/inventory/:inventoryId',
  SELL_INVENTORY: '/api/v1/inventory/sell/:inventoryId',
  ARCHIVE_INVENTORY: '/api/v1/inventory/archive/:inventoryId',
  DELETE_INVENTORY: '/api/v1/inventory/delete/:inventoryId',
  UPLOAD_INVENTORY_IMAGE: '/api/v1/inventory/upload',
  GET_INVENTORY_IMAGE: '/api/v1/inventory/image/:inventoryImageId',
  GET_STORE_DATA: '/api/v1/inventory/store',
  BUY_ITEM: '/api/v1/inventory/buy/:inventoryId',
};

export const Routes = {
  LOGIN: 'login',
  INVENTORY: 'inventory',
  STORE: 'store',
  TRANSACTION: 'transaction',
};
