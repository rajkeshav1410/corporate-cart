import { NgForOf } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AuthService,
  CustomHttpErrorResponse,
  FilterComponent,
  FilterService,
  ModalId,
  NotificationService,
  Routes,
  SeachKeyMenuData,
  UserInventory,
} from '@app/core';
import { StoreService } from '@app/store/service';
import { ItemCardComponent } from '../item-card';
import { ItemDetailComponent } from '../item-detail';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import {
  ActivatedRoute,
  convertToParamMap,
  Params,
  Router,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import Fuse from 'fuse.js';
import { FilterType } from '@app/core/models/filter.model';
import { lastValueFrom, map, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    ItemCardComponent,
    ItemDetailComponent,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    NgForOf,
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit, OnDestroy {
  itemList!: UserInventory[];

  filteredItemList!: UserInventory[];

  @ViewChild('itemDetail') itemDetail!: TemplateRef<unknown>;

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private filterService: FilterService,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: MatDialog,
    private overlay: Overlay,
  ) {}

  ngOnInit(): void {
    const fetchStoreData$ = lastValueFrom(this.fetchStoreData());
    fetchStoreData$.then(() => {
      this.activatedRoute.queryParams
        .pipe(
          takeUntil(this.onDestroy$),
          map((param) => convertToParamMap(param)),
        )
        .subscribe({
          next: (param) => {
            if (this.itemList && param && param.has('id')) {
              const item = this.itemList.find(
                (item) => item.id === param.get('id'),
              );
              item && this.openItemDetails(item);
            }
          },
        });
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  fetchStoreData = () =>
    this.storeService.getStoreItems().pipe(
      tap({
        next: (response: UserInventory[]) => {
          this.itemList = response;
          this.filteredItemList = response;
        },
      }),
    );

  public getIdTracking = (index: number, item: UserInventory) => {
    return item.id;
  };

  openItemDetails = (data: UserInventory) => {
    this.storeService.setStoreData(data);

    this.modalService.open(this.itemDetail, {
      id: ModalId.STORE_ITEM_DETAIL,
      height: '23rem',
      width: '50rem',
      maxWidth: '50rem',
      panelClass: ['custom-dialog-nobg'],
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disableClose: true,
    });
  };

  onBuy = async (inventory: UserInventory) => {
    const verified = await this.authService.verify();
    if (!verified) return;

    const userCoin = this.authService.getUser()?.coin || 0;
    if (userCoin < inventory.price) {
      this.notificationService.error(
        "You don't have enough coin to purchase this item!",
      );
      return;
    }

    this.storeService.buyItem(inventory.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Congratulations🎉 now you own this item',
        );
        this.fetchStoreData().subscribe();
        this.authService.verifyUser();
        this.modalService.getDialogById(ModalId.STORE_ITEM_DETAIL)?.close();
        this.router.navigate([Routes.INVENTORY]);
      },
      error: (error: CustomHttpErrorResponse) => {
        this.notificationService.error(error.error.message);
      },
    });
  };

  onAddWishlist = (inventoryId: string) => {
    console.log(inventoryId);
    // this.inventoryService.setInventoryData(editInventory, Action.EDIT);
    // this.openModalFromRight();
  };

  onCloseModal = () => {
    this.modalService.getDialogById(ModalId.STORE_ITEM_DETAIL)?.close();
    this.router.navigate([Routes.STORE]);
  };

  openFilterModal = () => {
    this.modalService
      .open(FilterComponent, {
        id: ModalId.FILTER,
        height: '100vh',
        width: '66vw',
        maxWidth: '66vw',
        position: { right: '0' },
        panelClass: [
          'custom-dialog',
          'animate__animated',
          'animate__slideInRight',
        ],
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      })
      .afterClosed()
      .subscribe({
        next: () => this.filterStoreData(),
      });
  };

  filterStoreData = () => {
    this.filterService.filterData.subscribe({
      next: (filter: FilterType) => {
        this.filteredItemList = this.filterItemList(this.itemList, filter);
      },
    });
  };

  filterItemList = (
    itemList: UserInventory[],
    filter: FilterType,
  ): UserInventory[] => {
    let filteredList: UserInventory[] = [...itemList];

    if (filter.search) {
      // let fuse: Fuse<UserInventory>;
      const options = {
        includeScore: true,
        keys: [] as string[],
      };

      switch (filter.searchKey || SeachKeyMenuData[0].viewValue) {
        case SeachKeyMenuData[0].viewValue:
          // options.keys = ['itemName'];
          filteredList = filteredList.filter((x) =>
            x.itemName
              .toLocaleLowerCase()
              .includes(filter.search.toLocaleLowerCase()),
          );
          break;
        case SeachKeyMenuData[1].viewValue:
          // options.keys = ['itemDescription'];
          filteredList = filteredList.filter((x) =>
            x.itemDescription
              .toLocaleLowerCase()
              .includes(filter.search.toLocaleLowerCase()),
          );
          break;
        case SeachKeyMenuData[2].viewValue:
          options.keys = ['seller.name', 'seller.email'];
          break;
        default:
          console.warn('Invalid search key');
          return [];
      }

      // fuse = new Fuse(filteredList, options);
      // filteredList = fuse.search(filter.search).map((result) => result.item);
    }

    if (filter.categories && filter.categories.length > 0) {
      filteredList = filteredList.filter((item) =>
        filter.categories.includes(item.category),
      );
    }

    if (filter.priceMin) {
      const minPrice = parseFloat(filter.priceMin);
      filteredList = filteredList.filter((item) => item.price >= minPrice);
    }
    if (filter.priceMax) {
      const maxPrice = parseFloat(filter.priceMax);
      filteredList = filteredList.filter((item) => item.price <= maxPrice);
    }

    if (filter.date) {
      const filterDate = new Date(filter.date);
      filteredList = filteredList.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getFullYear() === filterDate.getFullYear() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getDate() === filterDate.getDate()
        );
      });
    }

    return filteredList;
  };
}
