import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Product } from '@app/_models';

const baseUrl = `${environment.apiUrl}/products`;

@Injectable({ providedIn: 'root' })
export class ProductService {
    private productSubject: BehaviorSubject<Product | null>;
    public product: Observable<Product | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.productSubject = new BehaviorSubject<Product | null>(null);
        this.product = this.productSubject.asObservable();
    }

    public get productValue() {
        return this.productSubject.value;
    }

    getAll() {
        return this.http.get<Product[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Product>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        console.log({params})
        return this.http.post(baseUrl, params);
    }

    

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((product: any) => {
                // update the current product if it was updated
                if (product.id === this.productValue?.id) {
                    // publish updated product to subscribers
                    product = { ...this.productValue, ...product };
                    this.productSubject.next(product);
                }
                return product;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                // if (id === this.productValue?.id)
                //     this.logout();
            }));
    }

   

}