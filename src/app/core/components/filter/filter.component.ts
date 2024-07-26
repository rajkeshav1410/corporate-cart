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
  categoryList: MenuItem[] = CategoryMenuData;

  searchKeyList: MenuItem[] = SeachKeyMenuData;

  defaultSearchKey: string = 'Product title';

  filterForm = new FormGroup({
    search: new FormControl('', [Validators.maxLength(40)]),
    searchKey: new FormControl(this.defaultSearchKey),
    categories: new FormControl([] as string[]),
    priceMin: new FormControl(''),
    priceMax: new FormControl(''),
    date: new FormControl(''),
  });

  filter!: FilterType;

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private filterService: FilterService,
    private matDialogService: MatDialog,
  ) {}

  ngOnInit(): void {
    this.filterService.filterData.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (data: FilterType) => {
        this.filter = data;
        this.loadForm(this.filter);
      },
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  closeModal = () =>
    this.matDialogService.getDialogById(ModalId.FILTER)?.close();

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

  removeCategory = (category: string) => {
    const categories = this.filterForm.controls.categories.value as string[];
    this.removeFirst(categories, category);
    this.filterForm.controls.categories.setValue(categories);
  };

  categoryIndex = (index: number) => index;

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

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

  onClearFilter = () => {
    this.filterForm.reset({ searchKey: this.defaultSearchKey });
  };
}
