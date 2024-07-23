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

  categoryList: MenuItem[] = CategoryMenuData;

  // Saves data of user inventory in case of edit operation
  inventory!: UserInventory;

  // Disables save inventory button until data fields filled
  enableSave: boolean = false;

  formAction!: Action;

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private inventoryService: InventoryService,
    private matDialogService: MatDialog,
  ) {}

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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  closeModal = () =>
    this.matDialogService.getDialogById(ModalId.INVENTORY_CREATE_EDIT)?.close();

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

  getTitle = () =>
    this.formAction === Action.EDIT ? 'Update Inventory' : 'Create Inventory';

  onFileChange = (event: any) => {
    this.file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.url = reader.result?.toString() || '';
      this.enableSave = true;
    };
  };

  onSubmit = () => {
    const categeoryId = this.inventoryForm.get('category')?.value;
    console.log(categeoryId);
    let requestBody: CreateInventoryRequest = {
        itemName: this.inventoryForm.get('title')?.value!,
        itemDescription: this.inventoryForm.get('description')?.value!,
        price: parseFloat(this.inventoryForm.get('price')?.value!),
        category: getCategoryNameById(categeoryId!),
        inventoryImageId: '',
      },
      inventoryImageId,
      callFn;

    console.log(requestBody);

    if (this.formAction === Action.ADD) {
      inventoryImageId = crypto.randomUUID();
      requestBody.inventoryImageId = inventoryImageId;
      callFn = this.inventoryService.createUserInventory(requestBody);
    } else {
      inventoryImageId = this.inventory.inventoryImageId;
      // inventoryImageId = crypto.randomUUID();
      requestBody.inventoryImageId = inventoryImageId;
      callFn = this.inventoryService.updateUserInventory(
        requestBody,
        this.inventory.id,
      );
    }

    this.file && this.inventoryService.uploadImage(this.file, inventoryImageId);

    callFn.subscribe({
      next: () => this.closeModal(),
    });
  };

  categoryIndex = (index: number) => index;
}
