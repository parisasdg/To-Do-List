import { MatButtonModule } from '@angular/material/button';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../data-access/categories/categories.service';
import { Category } from '../../data-access/categories/categories.type';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss',
})
export class CategoryDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CategoryDialogComponent>);
  private categoryService = inject(CategoryService);
  readonly data = inject<Category>(MAT_DIALOG_DATA);
  title = new FormControl();

  ngOnInit(): void {
    this.title.setValue(this.data.title);
  }

  cancel() {
    this.dialogRef.close();
  }

  addCategory() {
    if (this.title.invalid) {
      this.title.markAsTouched();
      return;
    }
    if (this.data) {
      this.categoryService
        .updateCategory({
          ...this.data,
          title: this.title.value,
        })
        .subscribe((res) => {
          this.dialogRef.close();
        });
    } else {
      this.categoryService
        .insertCategory({ title: this.title.value })
        .subscribe((res) => {
          this.dialogRef.close();
        });
    }
  }
}
