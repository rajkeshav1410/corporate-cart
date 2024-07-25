import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UserInventory, getInventoryImageUrl, PLACEHOLDER } from '@app/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [
    MatCardModule,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    NgIf,
  ],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent {
  placeholder: string = PLACEHOLDER;

  @Input() item!: UserInventory;

  @Input() isDetailView: boolean = false;

  @Input() index: number = 0;

  @Output() onEdit = new EventEmitter<UserInventory>();

  @Output() onSell = new EventEmitter<string>();

  @Output() onUnlistSale = new EventEmitter<string>();

  @Output() onDelete = new EventEmitter<string>();

  @Output() onClose = new EventEmitter();

  getImageUrl = () => getInventoryImageUrl(this.item.inventoryImageId);

  onEditButtonClicked = () => this.onEdit.emit(this.item);

  onSellButtonClicked = () => this.onSell.emit(this.item.id);

  onUnlistSaleButtonClicked = () => this.onUnlistSale.emit(this.item.id);

  onDeleteButtonClicked = () => this.onDelete.emit(this.item.id);

  onCloseButtonClicked = () => this.onClose.emit();
}
