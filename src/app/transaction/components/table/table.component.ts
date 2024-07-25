import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  AuthUser,
  capitalize,
  HYPHN_STRING,
  StorageService,
  Transaction,
  TransactionTableView,
  transformName,
  UserInventory,
} from '@app/core';
import { TransactionService } from '@app/transaction/service';
import { Subject, takeUntil } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { PriceFormatPipe } from '@app/core/pipes';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatPaginator,
  ],
  providers: [DatePipe, PriceFormatPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  transactionData!: Transaction[];

  user!: AuthUser | null;

  public displayedColumns = [
    'type',
    'date',
    'item',
    'buyer',
    'seller',
    'price',
    'status',
  ];

  public dataSource = new MatTableDataSource<TransactionTableView>();

  @Output() onClick = new EventEmitter<UserInventory>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private transactionService: TransactionService,
    private storageService: StorageService,
    private datePipe: DatePipe,
    private pricePipe: PriceFormatPipe,
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();

    this.transactionService.transactionData
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (transactions) => {
          this.transactionData = transactions;

          this.dataSource.data = this.transactionData.map((data) => {
            return {
              transaction: data,
              type: capitalize(data.type.toString(), HYPHN_STRING),
              date: this.datePipe.transform(data.updatedAt, 'dd/MM/yyyy HH:mm'),
              item: data.saleInventory.itemName,
              buyer: this.formatName(data.buyer),
              seller: this.formatName(data.seller),
              price: this.pricePipe.transform(data.saleInventory.price),
              status: capitalize(data.status.toString()),
            } as TransactionTableView;
          });
        },
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  formatName = (data: AuthUser) => {
    if (this.user && this.user.email === data.email) return 'You';
    return transformName(data.name);
  };

  onRowClick = (data: TransactionTableView) => {
    this.onClick.emit(data.transaction.saleInventory);
  };
}
