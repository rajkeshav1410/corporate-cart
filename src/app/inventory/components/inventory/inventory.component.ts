import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Action, InventoryData, ModalId, UserInventory } from '@app/core';
import { InventoryService, InventoryFormComponent } from '@app/inventory';
import { ItemCardComponent } from '../item-card';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    ItemCardComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgForOf,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  userInventory!: UserInventory[];

  file!: File;

  constructor(
    private inventoryService: InventoryService,
    private matDialogService: MatDialog,
    private overlay: Overlay,
  ) {}

  ngOnInit(): void {
    this.fetchInventoryData();
  }

  fetchInventoryData = () =>
    this.inventoryService.getUserInventory().subscribe({
      next: (response) => {
        this.userInventory = response;
      },
    });

  public getIdTracking = (index: number, item: UserInventory) => {
    return item.id;
  };

  onAddClick = () => {
    this.inventoryService.setInventoryData({} as InventoryData, Action.ADD);
    this.openModalFromRight();
  };

  onEdit = (editInventory: UserInventory) => {
    this.inventoryService.setInventoryData(editInventory, Action.EDIT);
    this.openModalFromRight();
  };

  openModalFromRight = () => {
    this.matDialogService
      .open(InventoryFormComponent, {
        id: ModalId.INVENTORY_CREATE_EDIT,
        height: '100vh',
        width: '66vw',
        maxWidth: '66vw',
        position: { right: '0' },
        panelClass: [
          'custom-dialog',
          'animate__animated',
          'animate__slideInRight',
        ],
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      })
      .afterClosed()
      .subscribe({
        next: () => this.fetchInventoryData(),
      });
  };
}
