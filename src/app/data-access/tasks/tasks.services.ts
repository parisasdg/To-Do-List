import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from './tasks.type';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private _httpClient = inject(HttpClient);

  private _tasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  private _completedTasks: BehaviorSubject<Task[]> = new BehaviorSubject<
    Task[]
  >([]);

  get Tasks$(): Observable<Task[]> {
    return this._tasks.asObservable();
  }

  get CompeletedTasks$(): Observable<Task[]> {
    return this._completedTasks.asObservable();
  }

  getTasks(): Observable<Task[]> {
    return this._httpClient.get<Task[]>(`${environment.baseUrl}/tasks`);
  }

  insertTask(task: Task): Observable<Task> {
    return this._httpClient
      .post<Task>(`${environment.baseUrl}/tasks`, task)
      .pipe(
        tap((res) => {
          this._tasks.value.push(res);
          this._tasks.next(this._tasks.value);
        })
      );
  }

  getTask(list: string): Observable<Task[]> {
    return this._httpClient
      .get<Task[]>(`${environment.baseUrl}/tasks/query/${list}`)
      .pipe(tap((res) => this._tasks.next(res)));
  }

  updateTask(task: Task): Observable<any> {
    return this._httpClient
      .put<any>(`${environment.baseUrl}/tasks/${task._id}`, task)
      .pipe(
        tap((res) => {
          const tasks = this._tasks.value;
          const index = tasks.findIndex((t) => t._id === task._id);
          if (index > -1) {
            if (tasks[index].list !== task.list) {
              tasks.splice(index, 1);
            } else {
              tasks[index] = { ...tasks[index], ...task };
            }
            this._tasks.next([...tasks]);
          }
        })
      );
  }

  deleteTask(id: string): Observable<boolean> {
    return this._httpClient
      .delete<boolean>(`${environment.baseUrl}/tasks/${id}`)
      .pipe(
        tap(() => {
          const updatedTasks = this._tasks.value.filter((item) => {
            return item._id !== id.toString();
          });
          this._tasks.next(updatedTasks);
        })
      );
  }

  getCompeletedTask(): Observable<Task[]> {
    return this._httpClient
      .get<Task[]>(`${environment.baseUrl}/compeleted`)
      .pipe(tap((res) => this._completedTasks.next(res)));
  }
}
