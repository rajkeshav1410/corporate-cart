import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import {
  UserInventory,
  getInventoryImageUrl,
  StringConstants,
} from '@app/core';
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
  // Placeholder text for the component
  placeholder: string = StringConstants.PLACEHOLDER;

  // Input property for the item data to display
  @Input() item!: UserInventory;

  // Input property to determine if the item is displayed in detail view
  @Input() isDetailView: boolean = false;

  // Input property for the index of the item in the list
  @Input() index: number = 0;

  // Event emitter for editing an item
  @Output() onEdit = new EventEmitter<UserInventory>();

  // Event emitter for selling an item
  @Output() onSell = new EventEmitter<string>();

  // Event emitter for unlisting an item for sale
  @Output() onUnlistSale = new EventEmitter<string>();

  // Event emitter for deleting an item
  @Output() onDelete = new EventEmitter<string>();

  // Event emitter for closing the item card
  @Output() onClose = new EventEmitter();

  // Method to get the image URL for the item
  getImageUrl = () => getInventoryImageUrl(this.item.inventoryImageId);

  /**
   * Event handler for the edit button click event
   */
  onEditButtonClicked = () => this.onEdit.emit(this.item);

  /**
   * Event handler for the sell button click event
   */
  onSellButtonClicked = () => this.onSell.emit(this.item.id);

  /**
   * Event handler for the unlist sale button click event
   */
  onUnlistSaleButtonClicked = () => this.onUnlistSale.emit(this.item.id);

  /**
   * Event handler for the delete button click event
   */
  onDeleteButtonClicked = () => this.onDelete.emit(this.item.id);

  /**
   * Event handler for the close button click event
   */
  onCloseButtonClicked = () => this.onClose.emit();
}
