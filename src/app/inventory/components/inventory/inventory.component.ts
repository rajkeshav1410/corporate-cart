import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services';
import { UserInventory } from '../../../core';
import { ItemCardComponent } from '../item-card';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [ItemCardComponent, MatButtonModule, NgForOf],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  userInventory!: UserInventory[];

  file!: File;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.getUserInventory().subscribe({
      next: (response) => {
        this.userInventory = response;
      },
    });
  }

  onFileChange = (event: any) => {
    this.file = event.target.files[0];
  };

  onFileUpload = () => {
    this.inventoryService.uploadImage(this.file, '1');
  };
}
