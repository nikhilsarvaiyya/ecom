import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { ProductService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    
    color = ["#a946ec","#193a18","#4537f8","#daf185","#980b06"];
    size : any[] = []
    product : any[] = []
    account = this.accountService.accountValue;
    pic : any
    constructor(
        private accountService: AccountService,
        private productService: ProductService
        ) { }


    ngOnInit() {
        this.productService.getAll()
            .pipe(first())
            .subscribe(products => {
                this.product = products;
                
            } );
    }

    getUniqueSize(variants:any){
        let set = [...new Set(variants.map((m:any) => m.skus.map((m:any) => m.size)).flat(1))]
        return Array.from(set)
    }

    getUniqueColor(variants:any){
        let set = [...new Set(variants.map((m:any) => m.color).flat(1))]
        return Array.from(set)
      }

   
}