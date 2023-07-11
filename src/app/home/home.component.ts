import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { ProductService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    
    color = ["#a946ec","#193a18","#4537f8","#daf185","#980b06"]
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
            .subscribe(products => this.product = products );
    }

   
}