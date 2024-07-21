import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { API, getUrl, UserInventory } from '../../../core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [MatCardModule, NgOptimizedImage],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent implements OnInit {
  @Input() item!: UserInventory;

  ngOnInit(): void {
    // console.log(this.item);
  }

  getInventoryImageUrl = () =>
    getUrl(API.GET_INVENTORY_IMAGE, {
      inventoryImageId: this.item.inventoryImageId || 'default',
    });
}
