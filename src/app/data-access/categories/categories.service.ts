import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, tap } from 'rxjs';
import { Category } from './categories.type';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private _httpClient = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:3000/api';

  private _categories: BehaviorSubject<Category[]> = new BehaviorSubject<
    Category[]
  >([]);

  get Categories$(): Observable<Category[]> {
    return this._categories.asObservable();
  }

  getCategories(): Observable<Category[]> {
    return this._httpClient
      .get<Category[]>(`${this.baseUrl}/lists`)
      .pipe(tap((res) => this._categories.next(res)));
  }

  insertCategory(category: Category): Observable<Category> {
    return this._httpClient
      .post<Category>(`${this.baseUrl}/lists`, category)
      .pipe(
        tap((res) => {
          this._categories.value.push(res);
          this._categories.next(this._categories.value);
        })
      );
  }

  updateCategory(category: Category): Observable<Category> {
    return this._httpClient
      .put<Category>(`${this.baseUrl}/lists/${category._id}`, category)
      .pipe(
        tap((res) => {
          if (this._categories.value) {
            const index =
              this._categories.value.findIndex((x) => x._id === res._id) ?? 0;
            this._categories.value[index] = category;
            this._categories.next(this._categories.value);
          }
        })
      );
  }

  deleteCategory(id: string): Observable<Category> {
    return this._httpClient
      .delete<Category>(`${this.baseUrl}/lists/${id}`)
      .pipe(
        tap(() => {
          const updatedCategory = this._categories.value.filter(
            (item) => item._id !== id.toString()
          );
          this._categories.next(updatedCategory);
        })
      );
  }
}
