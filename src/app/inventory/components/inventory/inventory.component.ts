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
  // Array to store user's inventory items
  userInventory!: UserInventory[];

  // Placeholder for file input data
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

  /**
   * Fetches the user's inventory data from the service.
   */
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
   * @returns {number} - Trackable element index
   */
  public getIdTracking = (index: number, item: UserInventory) => {
    return item.id;
  };

  /**
   * Handles the click event for adding a new inventory item.
   */
  onAddClick = () => {
    this.inventoryService.setInventoryData({} as InventoryData, Action.ADD);
    this.openModalFromRight();
  };

  /**
   * Prepares for editing the selected inventory item.
   * @param {UserInventory} editInventory - Inventory to edit.
   */
  onEdit = (editInventory: UserInventory) => {
    this.inventoryService.setInventoryData(editInventory, Action.EDIT);
    this.openModalFromRight();
  };

  /**
   * Initiates the selling process for a specific inventory item.
   * @param {string} inventoryId - The ID of the inventory to sell.
   */
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

  /**
   * Handles unlisting an item from sale.
   * @param {string} inventoryId - The ID of the inventory to unlist.
   */
  onUnlistSale = (inventoryId: string) => {};

  /**
   * Deletes a specific inventory item.
   * @param {string} inventoryId - The ID of the inventory to delete.
   */
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

  /**
   * Opens a modal dialog for adding/editing inventory items from the right side.
   */
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
