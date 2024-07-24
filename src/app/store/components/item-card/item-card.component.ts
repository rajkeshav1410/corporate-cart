import { Overlay } from '@angular/cdk/overlay';
import { NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { getInventoryImageUrl, PLACEHOLDER, UserInventory } from '@app/core';
import { StoreService } from '@app/store/service';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [
    MatCardModule,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent {
  placeholder: string = PLACEHOLDER;

  @Input() item!: UserInventory;

  @Input() index: number = 0;

  @Output() onBuy = new EventEmitter<string>();

  @Output() onAddToWishlist = new EventEmitter<string>();

  constructor(
    private storeService: StoreService,
    private matDialogService: MatDialog,
    private overlay: Overlay,
  ) {}

  getImageUrl = () => getInventoryImageUrl(this.item.inventoryImageId);

  openItemDetails = () => {};

  onBuyq = () => {
    // this.storeService.setInventoryData({} as InventoryData, Action.ADD);
    // this.openModalFromRight();
  };

  onAddWishlist = (inventoryId: string) => {
    // this.inventoryService.setInventoryData(editInventory, Action.EDIT);
    // this.openModalFromRight();
  };
  
  onBuyButtonClicked = () => this.onBuy.emit(this.item.id);

  onWishlistButtonClicked = () => this.onAddToWishlist.emit(this.item.id);

  userCanBuy = () => {};
}
