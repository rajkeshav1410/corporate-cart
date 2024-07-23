import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Action,
  API,
  CreateInventoryRequest,
  getUrl,
  InventoryData,
  UserInventory,
} from '@app/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private _inventoryData = new BehaviorSubject({} as InventoryData);

  public readonly inventoryData = this._inventoryData.asObservable();

  constructor(private http: HttpClient) {}

  createUserInventory = (inventory: CreateInventoryRequest) =>
    this.http.post(API.CREATE_INVENTORY, inventory);

  getUserInventory = (): Observable<UserInventory[]> =>
    this.http.get<UserInventory[]>(API.GET_USER_INVENTORY);

  updateUserInventory = (
    inventory: CreateInventoryRequest,
    inventoryId: string,
  ) => this.http.post(getUrl(API.UPDATE_INVENTORY, { inventoryId }), inventory);

  uploadImage = (file: File, inventoryImageId: string): void => {
    const formData = new FormData();
    formData.append('imageName', inventoryImageId);
    formData.append('image', file);

    this.http.post(API.UPLOAD_INVENTORY_IMAGE, formData).subscribe({
      next: () => {},
    });
  };

  setInventoryData = (data: UserInventory, action: Action) => {
    this._inventoryData.next({
      action,
      ...data,
    });
  };
}
