import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInventory, API, getUrl, Transaction } from '@app/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private _transactionData = new BehaviorSubject<Transaction[]>([]);

  public readonly transactionData = this._transactionData.asObservable();

  constructor(private http: HttpClient) {}

  getTransactions = (): Observable<Transaction[]> =>
    this.http.post<Transaction[]>(API.GET_TRANSACTION_DATA, {});

  setTransactionData = (data: Transaction[]) =>
    this._transactionData.next(data);
}
