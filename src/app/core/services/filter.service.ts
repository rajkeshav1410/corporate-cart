import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterType } from '../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _filterData = new BehaviorSubject<FilterType>({} as FilterType);

  /**
   * Observable stream of filterData for external access.
   */
  public readonly filterData = this._filterData.asObservable();

  /**
   * Sets new filter data for the service.
   * @param {FilterType} data - The new filter data to be set.
   */
  setFilterData = (data: FilterType) => {
    this._filterData.next(data);
  };
}
