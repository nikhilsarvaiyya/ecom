import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import categoryJson from '../../../assets/data/category'

import { CategoryService } from '@app/_services';
const comments = categoryJson;
@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {

  treeData = comments
  ClickCounter : any ;
  categorys?: any[];
  selectedItem? : any
  noImage: any = '../assets/img/no-image.png'
  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll()
      .pipe(first())
      .subscribe(category => this.categorys = category);
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

  getInfoHandler(info: number) {
    console.log(info)
    this.selectedItem = info
  }
}