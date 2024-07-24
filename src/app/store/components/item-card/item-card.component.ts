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
  imports: [MatCardModule, NgOptimizedImage, MatButtonModule, MatIconModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent {
  placeholder: string = PLACEHOLDER;

  @Input() item!: UserInventory;

  @Input() index: number = 0;

  @Output() onClick = new EventEmitter<UserInventory>();

  getImageUrl = () => getInventoryImageUrl(this.item.inventoryImageId);

  openItemDetails = () => this.onClick.emit(this.item);
}
