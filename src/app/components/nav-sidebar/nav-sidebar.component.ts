import { Category } from './../../data-access/categories/categories.type';
import { Component, inject, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CategoryService } from '../../data-access/categories/categories.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Task } from '../../data-access/tasks/tasks.type';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nav-sidebar',
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './nav-sidebar.component.html',
  styleUrl: './nav-sidebar.component.scss',
})
export class NavSidebarComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private _snackBar = inject(MatSnackBar);
  categories: Category[] = [];
  readonly dialog = inject(MatDialog);
  tasks: Task[] = [];

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.Categories$.subscribe((res) => {
      this.categories = res;
    });
  }

  onAddCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      direction: 'rtl',
    });
    dialogRef.afterClosed().subscribe((res) => {
      this._snackBar.open('افزودن لیست با موفقیت انجام شد!', '', {
        horizontalPosition: 'left',
        verticalPosition: 'top',
        duration: 3000,
        direction: 'rtl',
      });
    });
  }

  deleteCategory(item: Category) {
    if (item._id) {
      this.categoryService.deleteCategory(item._id).subscribe((res) => {
        this._snackBar.open('لیست با موفقیت حذف شد!', '', {
          horizontalPosition: 'left',
          verticalPosition: 'top',
          duration: 3000,
          direction: 'rtl',
        });
      });
    }
  }

  editCategory(item: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      direction: 'rtl',
      data: item,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this._snackBar.open('لیست با موفقیت ویرایش شد!', '', {
        horizontalPosition: 'left',
        verticalPosition: 'top',
        duration: 3000,
        direction: 'rtl',
      });
    });
  }
}
