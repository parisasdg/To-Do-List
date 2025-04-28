import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../data-access/tasks/tasks.services';
import { Task } from '../../data-access/tasks/tasks.type';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PersianDatePipe } from '../../pipes/persian-date.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-compeleted-task',
  standalone: true,
  imports: [
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    PersianDatePipe,
    MatTooltipModule,
  ],
  templateUrl: './compeleted-task.component.html',
  styleUrl: './compeleted-task.component.scss',
})
export class CompeletedTaskComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'date', 'actions'];
  private taskService = inject(TaskService);
  compeetedTask: Task[] = [];
  dataSource = new MatTableDataSource<Task>(this.compeetedTask);

  ngOnInit(): void {
    this.taskService.getCompeletedTask().subscribe((res) => {
      this.compeetedTask = res;
      this.dataSource.data = res;
    });
  }

  deleteTask(task: Task) {
    if (task._id) {
      this.taskService.deleteTask(task._id).subscribe();
    }
  }
}
