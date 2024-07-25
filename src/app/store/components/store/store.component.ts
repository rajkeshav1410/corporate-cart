import { NgForOf } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  CustomHttpErrorResponse,
  ModalId,
  NotificationService,
  Routes,
  StorageService,
  UserInventory,
} from '@app/core';
import { StoreService } from '@app/store/service';
import { ItemCardComponent } from '../item-card';
import { ItemDetailComponent } from '../item-detail';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [ItemCardComponent, NgForOf, ItemDetailComponent, MatDialogModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  itemList!: UserInventory[];

  @ViewChild('itemDetail') itemDetail!: TemplateRef<any>;

  constructor(
    private storeService: StoreService,
    private storageService: StorageService,
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
}
