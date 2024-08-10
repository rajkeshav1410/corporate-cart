import { NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  getInventoryImageUrl,
  Routes,
  StringConstants,
  UserInventory,
} from '@app/core';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [MatCardModule, NgOptimizedImage, MatButtonModule, MatIconModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent {
  placeholder: string = StringConstants.PLACEHOLDER;

  @Input() item!: UserInventory;

  @Input() index: number = 0;

  constructor(private router: Router) {}

  getImageUrl = () => getInventoryImageUrl(this.item.inventoryImageId);

  openItemDetails = () => {
    this.router.navigate([Routes.STORE], {
      queryParams: {
        id: this.item.id,
      },
    });
  };
}
