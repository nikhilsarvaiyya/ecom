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

    getAll() {
        return this.http.get<Product[]>(baseUrl);
    }

}