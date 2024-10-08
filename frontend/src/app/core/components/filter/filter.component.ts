import { NgIf, NgForOf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  CategoryMenuData,
  ModalId,
  SeachKeyMenuData,
} from '@app/core/constants';
import { MenuItem } from '@app/core/models';
import { FilterService } from '@app/core/services';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Subject, takeUntil } from 'rxjs';
import { FilterType } from '@app/core/models/filter.model';

@Component({
  selector: 'app-filter',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit, OnDestroy {
  // List of categories for filtering
  categoryList: MenuItem[] = CategoryMenuData;

  // List of search keys for filtering
  searchKeyList: MenuItem[] = SeachKeyMenuData;

  // Default search key
  defaultSearchKey: string = 'Product title';

  // Form group for filtering
  filterForm = new FormGroup({
    search: new FormControl('', [Validators.maxLength(40)]),
    searchKey: new FormControl(this.defaultSearchKey),
    categories: new FormControl([] as string[]),
    priceMin: new FormControl(''),
    priceMax: new FormControl(''),
    date: new FormControl(''),
  });

  // Filter data object
  filter!: FilterType;

  // Subject to manage component destruction
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private filterService: FilterService,
    private matDialogService: MatDialog,
  ) {}

  /**
   * Initialization lifecycle hook
   */
  ngOnInit(): void {
    this.filterService.filterData.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (data: FilterType) => {
        this.filter = data;
        this.loadForm(this.filter);
      },
    });
  }

  /**
   * Clean up before component destruction
   */
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // Close modal dialog
  closeModal = () =>
    this.matDialogService.getDialogById(ModalId.FILTER)?.close();

  /**
   * Load form data with existing filter values
   * @param data - Filter data to load into the form
   */
  loadForm = (data: FilterType) => {
    this.filterForm.setValue({
      search: data.search || '',
      searchKey: data.searchKey || this.defaultSearchKey,
      categories: data.categories || [],
      priceMin: data.priceMin ? data.priceMin.toString() : '',
      priceMax: data.priceMax ? data.priceMax.toString() : '',
      date: data.date || '',
    });
  };

  /**
   * Remove a category from the filter
   * @param category - Category to remove
   */
  removeCategory = (category: string) => {
    const categories = this.filterForm.controls.categories.value as string[];
    this.removeFirst(categories, category);
    this.filterForm.controls.categories.setValue(categories);
  };

  /**
   * Get the index of the category
   * @param index - Category index
   * @returns Index value
   */
  categoryIndex = (index: number) => index;

  // Remove the first occurrence of an item from an array
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  /**
   * Apply the filter and set filter data
   */
  onApplyFilter = () => {
    this.filterService.setFilterData({
      search: this.filterForm.controls.search.value || '',
      searchKey:
        this.filterForm.controls.searchKey.value || this.defaultSearchKey,
      categories: this.filterForm.controls.categories.value || [],
      priceMin: this.filterForm.controls.priceMin.value || '',
      priceMax: this.filterForm.controls.priceMax.value || '',
      date: this.filterForm.controls.date.value || '',
    });

    this.closeModal();
  };

  /**
   * Clear the filter form
   */
  onClearFilter = () => {
    this.filterForm.reset({ searchKey: this.defaultSearchKey });
  };
}
