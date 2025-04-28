import { Routes } from '@angular/router';
import { CompeletedTaskComponent } from './components/compeleted-task/compeleted-task.component';
import { TasksComponent } from './components/tasks/tasks.component';

export const routes: Routes = [
  { path: '', redirectTo: 'list/daily', pathMatch: 'full' },
  { path: 'completedTask', component: CompeletedTaskComponent },
  { path: 'list/daily/:id', component: TasksComponent },
  { path: 'list/:id', component: TasksComponent },
  { path: '**', redirectTo: 'list/daily', pathMatch: 'full' },
];
