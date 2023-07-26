import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {MatInputModule} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AccountService, AlertService, CategoryService, ProductService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    category : any = [];


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private productService: ProductService,
        private alertService: AlertService,
        private categoryService : CategoryService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            image: [[]],
            category: [null, Validators.required],
            price: ['', Validators.required],
            description: ['', Validators.required],
        });

        this.getCategories('menu')
        this.title = 'Create Product';
        if (this.id) {
            // edit mode
            this.title = 'Edit Product';
            this.loading = true;
            this.productService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
    }
    setSelectedFiles(images: string) {
        this.form.controls['image'].setValue(images);
    }
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    getCategories(type:any){
        let val = {
            type:type,
            pattern : "flat"
          }
        this.categoryService.getAllByType(val)
        .pipe(first())
        .subscribe(category => this.category = category);
    
        // this.categoryService.getAll()
        //   .pipe(first())
        //   .subscribe(category => this.categorys = category);
      }

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
        if (this.id) {
            saveProduct = () => this.productService.update(this.id!, this.form.value);
            message = 'Product updated';
        } else {
            saveProduct = () => this.productService.create(this.form.value);
            message = 'Product created';
        }

        saveProduct()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success(message, { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/admin/products');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}


