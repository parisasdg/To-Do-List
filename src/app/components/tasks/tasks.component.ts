import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../data-access/categories/categories.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../data-access/categories/categories.type';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { Task } from '../../data-access/tasks/tasks.type';
import { MatListModule } from '@angular/material/list';
import { TaskService } from '../../data-access/tasks/tasks.services';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PersianDatePipe } from '../../pipes/persian-date.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    PersianDatePipe,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'date', 'actions'];
  private categoryService = inject(CategoryService);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  category: Category | undefined;
  tasks!: Task[];
  categories: Category[] = [];
  dataSource = new MatTableDataSource<Task>(this.tasks);
  private routeSubscription!: Subscription;

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getCategories(id);
      }
    });

    this.taskService.Tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.dataSource.data = tasks;
    });
  }

  getCategories(id?: string) {
    this.categoryService.Categories$.subscribe((res: Category[]) => {
      this.categories = res;
      if (id) {
        this.category = this.categories.find((category) => category._id === id);
        this.getTasks();
      }
    });
  }

  getTasks() {
    if (this.category && this.category._id) {
      this.taskService.getTask(this.category._id).subscribe((res) => {
        this.tasks = res;
        this.dataSource.data = res;
      });
    }
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

  onAddTaskDialog() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      direction: 'rtl',
      data: {
        category: this.category,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this._snackBar.open('افزودن تسک با موفقیت انجام شد!', '', {
        horizontalPosition: 'left',
        verticalPosition: 'top',
        duration: 3000,
        direction: 'rtl',
      });
    });
  }

  completeTask(task: Task) {
    if (!task.done) {
      const updatedTask = { ...task, done: true };
      this.taskService.updateTask(updatedTask).subscribe((res) => {
        this._snackBar.open('تسک انجام شد!', '', {
          horizontalPosition: 'left',
          verticalPosition: 'top',
          duration: 3000,
          direction: 'rtl',
        });
      });
    }
  }

  deleteTask(task: Task) {
    if (task._id) {
      this.taskService.deleteTask(task._id).subscribe((res) => {
        this._snackBar.open('تسک با موفقیت حذف شد!', '', {
          horizontalPosition: 'left',
          verticalPosition: 'top',
          duration: 3000,
          direction: 'rtl',
        });
      });
    }
  }

  editTask(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      direction: 'rtl',
      data: {
        task: task,
        category: this.category,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      this._snackBar.open('تسک با موفقیت ویرایش شد!', '', {
        horizontalPosition: 'left',
        verticalPosition: 'top',
        duration: 3000,
        direction: 'rtl',
      });
    });
  }

  moveToDailyList(task: Task) {
    const mainCategoryId = this.categories.find(
      (category) => category.isMain
    )?._id;
    if (mainCategoryId && task._id) {
      const updatedTask = { ...task, list: mainCategoryId };
      this.taskService.updateTask(updatedTask).subscribe((res) => {
        this._snackBar.open('تسک به لیست کارهای روزانه منتقل شد!', '', {
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

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
