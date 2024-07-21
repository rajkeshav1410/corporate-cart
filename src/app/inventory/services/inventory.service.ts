import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API, getUrl, UserInventory } from '../../core';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private http: HttpClient) {}

  getUserInventory = (): Observable<UserInventory[]> => {
    return this.http.get<UserInventory[]>(API.GET_USER_INVENTORY);
  };

  uploadImage = (file: File, inventoryImageId: string): void => {
    const formData = new FormData();
    formData.append('imageName', inventoryImageId);
    formData.append('image', file);

    this.http
      .post(API.UPLOAD_INVENTORY_IMAGE, formData)
      .subscribe({
        next: () => {},
      });
  };
}
