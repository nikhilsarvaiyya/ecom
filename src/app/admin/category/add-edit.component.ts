import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {first, map, startWith} from 'rxjs/operators';

import { AccountService, AlertService, CategoryService, ProductService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    myControl = new FormControl('');
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions!: Observable<string[]>;
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    category = [];
    zeroPath = '';
    allSubCategory : any = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private productService: ProductService,
        private categoryService: CategoryService,
        
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.zeroPath = this.route.snapshot.url[0].path;
        

        this.form = this.formBuilder.group({
            category: ['', Validators.required],
            subCategory: [[]],
        });

        this.filterByCategory()
       
        this.title = 'Create Category';
        if (this.id) {
            // edit mode
            this.title = 'Edit Category';
            this.loading = true;
            this.categoryService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                    this.addSubcategory()
                });
        }
    }

    filterByCategory(){
        this.filteredOptions = this.form.controls.category.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    setSelectedFiles(images: string) {
        this.form.controls['image'].setValue(images);
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;

        // create or update account based on id param
        let saveProduct;
        let message: string;
        this.form.controls.subCategory.setValue(this.allSubCategory)
        if (this.id) {
            saveProduct = () => this.categoryService.update(this.id!, this.form.value);
            message = 'Category updated';
        } else {
            saveProduct = () => this.categoryService.create(this.form.value);
            message = 'Category created';
        }

        saveProduct()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success(message, { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/admin/category');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }


    addSubcategory(){
       let a = this.form.controls.subCategory.value;
       this.allSubCategory = this.allSubCategory.concat(a);
       this.form.controls.subCategory.setValue('')
    }

    removeSubcategory(subCat:any){
        let filterList = this.allSubCategory.filter((m:any) => m !== subCat);
        console.log(this.allSubCategory)
        this.allSubCategory = filterList
     }

    private _filter(value: string): string[] {
        console.log(value)
        const filterValue = value.toLowerCase();
    
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
      }
}


