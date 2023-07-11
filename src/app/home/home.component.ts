import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { ProductService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    list = [1,2,3,4,5,6,7,8,9,0];
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

    setDefaultPic() {
        this.pic = "/assets/img/no-image.png";
    }
}