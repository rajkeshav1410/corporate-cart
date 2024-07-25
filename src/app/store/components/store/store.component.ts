import { NgForOf } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  CustomHttpErrorResponse,
  FilterComponent,
  FilterService,
  ModalId,
  NotificationService,
  Routes,
  SeachKeyMenuData,
  StorageService,
  UserInventory,
} from '@app/core';
import { StoreService } from '@app/store/service';
import { ItemCardComponent } from '../item-card';
import { ItemDetailComponent } from '../item-detail';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Fuse from 'fuse.js';
import { FilterType } from '@app/core/models/filter.model';

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
export class StoreComponent implements OnInit {
  itemList!: UserInventory[];

  filteredItemList!: UserInventory[];

  @ViewChild('itemDetail') itemDetail!: TemplateRef<any>;

  constructor(
    private storeService: StoreService,
    private storageService: StorageService,
    private filterService: FilterService,
    private notificationService: NotificationService,
    private router: Router,
    private matDialogService: MatDialog,
    private overlay: Overlay,
  ) {}

  ngOnInit(): void {
    this.fetchStoreData();
  }

  fetchStoreData = () =>
    this.storeService.getStoreItems().subscribe({
      next: (response: UserInventory[]) => {
        this.itemList = response;
        this.filteredItemList = response;
      },
    });

  public getIdTracking = (index: number, item: UserInventory) => {
    return item.id;
  };

  openItemDetails = (data: UserInventory) => {
    this.storeService.setStoreData(data);
    this.matDialogService.open(this.itemDetail, {
      id: ModalId.STORE_ITEM_DETAIL,
      height: '23rem',
      width: '50rem',
      maxWidth: '50rem',
      panelClass: ['custom-dialog-nobg'],
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
  };

  onBuy = (inventory: UserInventory) => {
    if (!this.storageService.isLoggedIn()) this.router.navigate([Routes.LOGIN]);

    const userCoin = this.storageService.getUser()?.coin || 0;
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
        this.fetchStoreData();
        this.storageService.refreshUser();
        this.matDialogService.getDialogById(ModalId.STORE_ITEM_DETAIL)?.close();
      },
      error: (error: CustomHttpErrorResponse) => {
        this.notificationService.error(error.error.message);
      },
    });
  };

  onAddWishlist = (inventoryId: string) => {
    // this.inventoryService.setInventoryData(editInventory, Action.EDIT);
    // this.openModalFromRight();
  };

  openFilterModal = () => {
    this.matDialogService
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
        console.log(filter);
        this.filteredItemList = this.filterItemList(this.itemList, filter);
        console.log(this.filteredItemList);
      },
    });
  };

  filterItemList = (
    itemList: UserInventory[],
    filter: FilterType,
  ): UserInventory[] => {
    let filteredList: UserInventory[] = [...itemList];

    if (filter.search) {
      let fuse: Fuse<UserInventory>;
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

      // console.log(options);
      // fuse = new Fuse(filteredList, options);
      // filteredList = fuse.search(filter.search).map((result) => result.item);
      console.log('filteredList');
      console.log(filteredList);
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
