import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  Action,
  CategoryMenuData,
  CreateInventoryRequest,
  getCategoryIdByName,
  getCategoryNameById,
  getInventoryImageUrl,
  InventoryData,
  MenuItem,
  ModalId,
  NotificationService,
  UserInventory,
  Validation,
} from '@app/core';
import { InventoryService } from '@app/inventory/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    NgOptimizedImage,
    MatSelectModule,
    NgIf,
    NgForOf,
  ],
  templateUrl: './inventory-form.component.html',
  styleUrl: './inventory-form.component.scss',
})
export class InventoryFormComponent implements OnInit, OnDestroy {
  // Form group for inventory details
  inventoryForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(40),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(20),
    ]),
    category: new FormControl('', [Validators.required]),
    price: new FormControl('', [
      Validators.required,
      Validators.pattern(Validation.numRegex),
      Validators.min(0),
      Validators.max(999999),
    ]),
  });

  // Image file to image upload
  file!: File;

  // Image file url to show instantly before upload
  url: string = '';

  // List of categories for the menu
  categoryList: MenuItem[] = CategoryMenuData;

  // User inventory data for editing
  inventory!: UserInventory;

  // Disables save inventory button until data fields filled
  enableSave: boolean = false;

  // Action to perform on the form
  formAction!: Action;

  // Subject to manage component destruction
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
    private matDialogService: MatDialog,
  ) {}

  /**
   * Initialization lifecycle hook
   */
  ngOnInit(): void {
    this.inventoryService.inventoryData
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: InventoryData) => {
          const { action, ...restData } = data;
          this.formAction = action;
          this.inventory = restData;
          if (data.action === Action.EDIT) this.loadForm(restData);
        },
      });
  }

  /**
   * Clean up before component destruction
   */
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // Close modal dialog
  closeModal = () =>
    this.matDialogService.getDialogById(ModalId.INVENTORY_CREATE_EDIT)?.close();

  /**
   * Load form fields with existing inventory data
   * @param data - UserInventory data to load into the form
   */
  loadForm = (data: UserInventory) => {
    this.inventoryForm.setValue({
      title: data.itemName,
      description: data.itemDescription,
      category: getCategoryIdByName(data.category),
      price: data.price.toString(),
    });

    this.url = getInventoryImageUrl(data.inventoryImageId);
    this.enableSave = true;
  };

  /**
   * Get the title based on the form action
   * @returns Title for the form
   */
  getTitle = () =>
    this.formAction === Action.EDIT ? 'Update Inventory' : 'Create Inventory';

  /**
   * Handle file change event for uploading images
   * @param event - Input change event
   */
  onFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.file = input.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.url = reader.result?.toString() || '';
      this.enableSave = true;
    };
  };

  /**
   * Submit the form data for inventory management
   */
  onSubmit = () => {
    const categeoryId = this.inventoryForm.get('category')?.value;
    const requestBody: CreateInventoryRequest = {
      itemName:
        this.inventoryForm.get('title')?.value || this.inventory.itemName,
      itemDescription:
        this.inventoryForm.get('description')?.value ||
        this.inventory.itemDescription,
      price: parseFloat(
        this.inventoryForm.get('price')?.value ||
          this.inventory.price.toString(),
      ),
      category: getCategoryNameById(categeoryId!) || this.inventory.category,
      inventoryImageId: '',
    };
    let inventoryImageId, callFn;

    if (this.formAction === Action.ADD) {
      inventoryImageId = crypto.randomUUID();
      requestBody.inventoryImageId = inventoryImageId;
      callFn = this.inventoryService.createUserInventory(requestBody);
      this.notificationService.success('Item added to inventory');
    } else {
      inventoryImageId = this.inventory.inventoryImageId || crypto.randomUUID();
      // inventoryImageId = crypto.randomUUID();
      requestBody.inventoryImageId = inventoryImageId;
      callFn = this.inventoryService.updateUserInventory(
        requestBody,
        this.inventory.id,
      );
    }

    this.file && this.inventoryService.uploadImage(this.file, inventoryImageId);

    callFn.subscribe({
      next: () => {
        this.formAction === Action.ADD
          ? this.notificationService.success('New item added to inventory')
          : this.notificationService.success('Item updated in inventory');

        this.closeModal();
      },
    });
  };

  /**
   * Get the index for the category
   * @param index - Category index
   * @returns Index value
   */
  categoryIndex = (index: number) => index;
}
