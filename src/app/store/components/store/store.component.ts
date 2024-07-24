import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserInventory } from '@app/core';
import { StoreService } from '@app/store/service';
import { ItemCardComponent } from '../item-card';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [ItemCardComponent, NgForOf],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  itemList!: UserInventory[];

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.fetchStoreData();
  }

  fetchStoreData = () =>
    this.storeService.getStoreItems().subscribe({
      next: (response: UserInventory[]) => {
        this.itemList = response;
      },
    });

  public getIdTracking = (index: number, item: UserInventory) => {
    return item.id;
  };
}
