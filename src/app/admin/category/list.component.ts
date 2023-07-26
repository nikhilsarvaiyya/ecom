import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';

import categoryJson from '../../../assets/data/category'

import { CategoryService, AlertService } from '@app/_services';
const comments = categoryJson;
@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  createNewCategory!: FormGroup;
  categorys?: any[] | undefined;
  typeOfCategory?:any = 'menu'
  selectedCategory?: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  get f() { return this.createNewCategory.controls; }

  ngOnInit() {
    this.handleType('menu')
    this.setFormBuilder()
  }

  setFormBuilder(){
    this.createNewCategory = this.formBuilder.group({
      name: ['Category Name', Validators.required],
      category: ['menu', Validators.required],
      level: [1, Validators.required],
      parentId: [null],
    });
  }

  handleType(type:any){
    this.typeOfCategory = type
    let val = {
      type:type,
      pattern : "tree"
    }
    this.categoryService.getAllByType(val)
    .pipe(first())
    .subscribe(category => this.categorys = category);

    // this.categoryService.getAll()
    //   .pipe(first())
    //   .subscribe(category => this.categorys = category);
  }
  

  onSubmit(action: any) {
   
    // reset alerts on submit
    this.alertService.clear();

     // stop here if form is invalid
    if (this.createNewCategory.invalid) {
      return;
    }

    let saveProduct;
    let message: string;
    
    this.f.category.setValue(this.typeOfCategory);
   

    if (action === 'editCategory') {
      this.f.parentId.setValue(this.selectedCategory?.parentId );
      this.f.level.setValue(Number(this.selectedCategory?.level));
      saveProduct = () => this.categoryService.update(this.selectedCategory.id!, this.createNewCategory.value);
      message = 'Category updated';
    } else if (action === 'addSubCategory') {
      this.f.parentId.setValue(this.selectedCategory?.id );
      this.f.level.setValue(Number(this.selectedCategory?.level) + 1);
      saveProduct = () => this.categoryService.create(this.createNewCategory.value);
      message = 'Category created';
    } else  {
      this.f.parentId.setValue(null);
      this.f.level.setValue(1);
      saveProduct = () => this.categoryService.create(this.createNewCategory.value);
      message = 'Category created';
    } 

    saveProduct()
      .pipe(first())
      .subscribe({
        next: (data) => {
          
        this.handleType(this.typeOfCategory)
        this.alertService.success(message, { keepAfterRouteChange: true });
        this.router.navigate(['/admin/category']);
        },
        error: error => {
          this.alertService.error(error);
        }
      });
  }

  getInfoHandler(info: any) {
    this.selectedCategory = info;
    this.f.name.setValue(info.name);
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
