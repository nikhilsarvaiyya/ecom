import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ProductService } from '@app/_services';
const list = {
    value: 1,
    next: {
      value: 2,
      next: {
        value: 3,
        next: {
          value: 4,
          next: null
        }
      }
    }
  };
@Component({ templateUrl: 'list.component.html' })



export class ListComponent implements OnInit {
    products?: any[];
    noImage : any = '../assets/img/no-image.png'
    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.productService.getAll()
            .pipe(first())
            .subscribe(products => {
                this.products = products;
                
                return this.products
            });

            console.log(this.get_keys(list))
    }

    deleteProduct(id: string) {
        const product = this.products!.find(x => x.id === id);
        product.isDeleting = true;
        this.productService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.products = this.products!.filter(x => x.id !== id)
            });
    }

     get_keys = ({name, parentId} : any) :any => 
	    parentId ? [name, ...this.get_keys(parentId)] : [name];
}