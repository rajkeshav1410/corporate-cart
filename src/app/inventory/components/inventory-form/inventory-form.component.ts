import { NgIf, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Validation } from '@app/core';

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
    NgIf,
  ],
  templateUrl: './inventory-form.component.html',
  styleUrl: './inventory-form.component.scss',
})
export class InventoryFormComponent {
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
    price: new FormControl('', [
      Validators.required,
      Validators.pattern(Validation.numRegex),
      Validators.min(0),
      Validators.max(999999),
    ]),
  });

  file!: File;

  url: string = '';

  enableSave: boolean = false;

  constructor() {
    this.inventoryForm.setValue({
      title: 'keshav',
      description: '',
      price: '',
    });
    this.inventoryForm.get('title')?.hasError('');
  }

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
    const id = crypto.randomUUID();
  };
}
