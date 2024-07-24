import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PLACEHOLDER, UserInventory } from '@app/core';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss',
})
export class ItemDetailComponent {
  placeholder: string = PLACEHOLDER;

  @Input() item!: UserInventory;

  @Output() onBuy = new EventEmitter<string>();

  @Output() onAddToWishlist = new EventEmitter<string>();

  onBuyButtonClicked = () => this.onBuy.emit(this.item.id);

  onWishlistButtonClicked = () => this.onAddToWishlist.emit(this.item.id);

  userCanBuy = () => {};
}
