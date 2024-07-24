import { NgOptimizedImage, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  getInventoryImageUrl,
  ModalId,
  PLACEHOLDER,
  UserInventory,
} from '@app/core';
import { StoreService } from '@app/store';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    NgOptimizedImage,
    NgIf,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss',
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  placeholder: string = PLACEHOLDER;

  @Input() item!: UserInventory;

  @Output() onBuy = new EventEmitter<UserInventory>();

  @Output() onAddToWishlist = new EventEmitter<string>();

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private storeService: StoreService,
    private matDialogService: MatDialog,
  ) {}

  ngOnInit(): void {
    this.storeService.storeData.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (data: UserInventory) => {
        this.item = data;
      },
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  closeModal = () =>
    this.matDialogService.getDialogById(ModalId.STORE_ITEM_DETAIL)?.close();

  getImageUrl = () => getInventoryImageUrl(this.item.inventoryImageId);

  onBuyButtonClicked = () => this.onBuy.emit(this.item);

  onWishlistButtonClicked = () => this.onAddToWishlist.emit(this.item.id);

  userCanBuy = () => {};
}
