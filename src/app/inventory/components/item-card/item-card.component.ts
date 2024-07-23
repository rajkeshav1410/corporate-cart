import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserInventory, getUrl, API } from '@app/core';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [MatCardModule, NgOptimizedImage, MatButtonModule, MatIconModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent implements OnInit {
  @Input() item!: UserInventory;

  @Input() index: number = 0;

  ngOnInit(): void {
    // console.log(this.item);
  }

  getInventoryImageUrl = () =>
    getUrl(API.GET_INVENTORY_IMAGE, {
      inventoryImageId: this.item.inventoryImageId || 'default',
    });
}
