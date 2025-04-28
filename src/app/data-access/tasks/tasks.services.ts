import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from './tasks.type';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private _httpClient = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:3000/api';

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
    return this._httpClient.get<Task[]>(`${this.baseUrl}/tasks`);
  }

  insertTask(task: Task): Observable<Task> {
    return this._httpClient.post<Task>(`${this.baseUrl}/tasks`, task).pipe(
      tap((res) => {
        this._tasks.value.push(res);
        this._tasks.next(this._tasks.value);
      })
    );
  }

  getTask(list: string): Observable<Task[]> {
    return this._httpClient
      .get<Task[]>(`${this.baseUrl}/tasks/query/${list}`)
      .pipe(tap((res) => this._tasks.next(res)));
  }

  updateTask(task: Task): Observable<any> {
    return this._httpClient
      .put<any>(`${this.baseUrl}/tasks/${task._id}`, task)
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
    return this._httpClient.delete<boolean>(`${this.baseUrl}/tasks/${id}`).pipe(
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
      .get<Task[]>(`${this.baseUrl}/compeleted`)
      .pipe(tap((res) => this._completedTasks.next(res)));
  }
}
