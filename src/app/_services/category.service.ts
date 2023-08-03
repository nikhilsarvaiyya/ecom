import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Category } from '@app/_models';

const baseUrl = `${environment.apiUrl}/category`;

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private categorySubject: BehaviorSubject<Category | null>;
    public category: Observable<Category | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.categorySubject = new BehaviorSubject<Category | null>(null);
        this.category = this.categorySubject.asObservable();
    }

    public get categoryValue() {
        return this.categorySubject.value;
    }

    getAll(type : string) {
        return this.http.get<Category[]>(`${baseUrl}/${type}`);
    }

    getAllByType(data:any) {
        return this.http.get<Category[]>(`${baseUrl}/${data.type}/${data.pattern}`);
    }
    
    getById(id: string) {
        return this.http.get<Category>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((category: any) => {
                // update the current category if it was updated
                if (category.id === this.categoryValue?.id) {
                    // publish updated category to subscribers
                    category = { ...this.categoryValue, ...category };
                    this.categorySubject.next(category);
                }
                return category;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                // if (id === this.categoryValue?.id)
                //     this.logout();
            }));
    }

   

}