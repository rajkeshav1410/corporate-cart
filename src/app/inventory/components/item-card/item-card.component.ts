import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UserInventory, getInventoryImageUrl, PLACEHOLDER } from '@app/core';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [
    MatCardModule,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent implements OnInit {
  placeholder: string = PLACEHOLDER;

  @Input() item!: UserInventory;

  @Input() index: number = 0;

  @Output() onEdit = new EventEmitter<UserInventory>();

  @Output() onSell = new EventEmitter<string>();

  @Output() onUnlistSale = new EventEmitter<string>();

  @Output() onDelete = new EventEmitter<string>();

  ngOnInit(): void {
    // console.log(this.item);
  }

  getImageUrl = () => getInventoryImageUrl(this.item.inventoryImageId);

  onEditButtonClicked = () => this.onEdit.emit(this.item);

  onSellButtonClicked = () => this.onSell.emit(this.item.id);

  onUnlistSaleButtonClicked = () => this.onUnlistSale.emit(this.item.id);
  
  onDeleteButtonClicked = () => this.onDelete.emit(this.item.id);
}
