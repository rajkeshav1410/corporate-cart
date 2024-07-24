import { NgForOf } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalId, UserInventory } from '@app/core';
import { StoreService } from '@app/store/service';
import { ItemCardComponent } from '../item-card';
import { ItemDetailComponent } from '../item-detail';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { InventoryFormComponent } from '@app/inventory';

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
      // height: '100vh',
      // width: '66vw',
      // maxWidth: '66vw',
      // position: { right: '0' },
      panelClass: ['custom-dialog'],
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });
  };

  onBuy = (inventoryId: string) => {
    // this.storeService.setInventoryData({} as InventoryData, Action.ADD);
    // this.openModalFromRight();
  };

  onAddWishlist = (inventoryId: string) => {
    // this.inventoryService.setInventoryData(editInventory, Action.EDIT);
    // this.openModalFromRight();
  };
}
