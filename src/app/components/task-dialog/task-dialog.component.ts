import { TaskService } from './../../data-access/tasks/tasks.services';
import { Task } from './../../data-access/tasks/tasks.type';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
})
export class TaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  private taskService = inject(TaskService);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly task = this.data.task;
  readonly category = this.data.category;
  title = new FormControl();
  description = new FormControl();

  ngOnInit(): void {
    if (this.task) {
      this.title.setValue(this.task.title ?? '');
      this.description.setValue(this.task.description ?? '');
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  addTask() {
    if (this.title.invalid) {
      this.title.markAsTouched();
      return;
    }

    if (this.data.task) {
      this.taskService
        .updateTask({
          ...this.data.task,
          title: this.title.value,
          description: this.description.value,
          done: false,
          list: this.category._id,
        })
        .subscribe((res) => {
          this.dialogRef.close();
        });
    } else {
      this.taskService
        .insertTask({
          title: this.title.value,
          description: this.description.value,
          done: false,
          list: this.category._id,
        })
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }
}
