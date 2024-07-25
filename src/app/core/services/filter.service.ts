import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterType } from '../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _filterData = new BehaviorSubject<FilterType>({} as FilterType);

  public readonly filterData = this._filterData.asObservable();

  setFilterData = (data: FilterType) => {
    this._filterData.next(data);
  };
}
