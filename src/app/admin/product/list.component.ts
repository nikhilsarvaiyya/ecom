import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ProductService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    products?: any[];

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.productService.getAll()
            .pipe(first())
            .subscribe(products => this.products = products );
    }

    // deleteAccount(id: string) {
    //     const account = this.products!.find(x => x.id === id);
    //     account.isDeleting = true;
    //     this.productService.delete(id)
    //         .pipe(first())
    //         .subscribe(() => {
    //             this.products = this.products!.filter(x => x.id !== id)
    //         });
    // }
}