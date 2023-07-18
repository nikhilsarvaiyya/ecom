import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { CategoryService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    categorys?: any[];
    noImage : any = '../assets/img/no-image.png'
    constructor(private categoryService: CategoryService) { }

    ngOnInit() {
        this.categoryService.getAll()
            .pipe(first())
            .subscribe(category => this.categorys = category );
    }

    deleteProduct(id: string) {
        const category = this.categorys!.find(x => x.id === id);
        category.isDeleting = true;
        this.categoryService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.categorys = this.categorys!.filter(x => x.id !== id)
            });
    }
}