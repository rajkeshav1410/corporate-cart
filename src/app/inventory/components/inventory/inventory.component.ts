import { NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  Action,
  CustomHttpErrorResponse,
  getErrorMessage,
  InventoryData,
  ModalId,
  NumberConstants,
  NotificationService,
  UserInventory,
} from '@app/core';
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
    private notificationService: NotificationService,
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
      error: (error: CustomHttpErrorResponse) =>
        this.notificationService.error(getErrorMessage(error)),
    });

  /**
   * Gets the trackable index for the template
   * @param {number} index - Index value from ngFor.
   * @param {UserInventory} item - Object ref from ngFor
   * @returns - Trackable element index
   */
  public getIdTracking = (index: number, item: UserInventory) => {
    return item.id;
  };

  onAddClick = () => {
    this.inventoryService.setInventoryData({} as InventoryData, Action.ADD);
    this.openModalFromRight();
  };

  /**
   * Pushes inventory data to service and loads inventory edit form
   * @param {UserInventory} editInventory - Inventory to edit.
   */
  onEdit = (editInventory: UserInventory) => {
    this.inventoryService.setInventoryData(editInventory, Action.EDIT);
    this.openModalFromRight();
  };

  onSell = (inventoryId: string) => {
    this.inventoryService.sellUserInventory(inventoryId).subscribe({
      next: () => {
        const index = this.userInventory.findIndex(
          (inventory) => inventory.id == inventoryId,
        );

        if (index !== NumberConstants.NEG_ONE)
          this.userInventory[index].onSale = true;

        this.notificationService.success('Your item is on sale now');
      },
    });
  };

  onUnlistSale = (inventoryId: string) => {};

  onDelete = (inventoryId: string) => {
    this.inventoryService.deleteUserInventory(inventoryId).subscribe({
      next: () => {
        const index = this.userInventory.findIndex(
          (inventory) => inventory.id === inventoryId,
        );
        index !== NumberConstants.NEG_ONE &&
          this.userInventory.splice(index, NumberConstants.ONE);
        this.notificationService.success('Item deleted successfully');
      },
      error: (error: CustomHttpErrorResponse) =>
        this.notificationService.error(getErrorMessage(error)),
    });
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
