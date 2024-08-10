import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API, getUrl, UserInventory } from '@app/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private _storeData = new BehaviorSubject({} as UserInventory);

  public readonly storeData = this._storeData.asObservable();

  constructor(private http: HttpClient) {}

  getStoreItems = (): Observable<UserInventory[]> =>
    this.http.get<UserInventory[]>(API.GET_STORE_DATA);

  setStoreData = (data: UserInventory) => this._storeData.next(data);

  buyItem = (inventoryId: string) =>
    this.http.post(getUrl(API.BUY_ITEM, { inventoryId }), null);
}
