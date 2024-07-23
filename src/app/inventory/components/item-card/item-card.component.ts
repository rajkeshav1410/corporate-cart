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

  ngOnInit(): void {
    // console.log(this.item);
  }

  // getInventoryImageUrl = () =>
  //   getUrl(API.GET_INVENTORY_IMAGE, {
  //     inventoryImageId: this.item.inventoryImageId || 'default',
  //   });

  getImageUrl = () => getInventoryImageUrl(this.item.inventoryImageId);

  onEditButtonClicked = () => this.onEdit.emit(this.item);
}
