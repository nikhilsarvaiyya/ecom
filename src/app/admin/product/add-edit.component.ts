import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService, CategoryService, ProductService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })

export class AddEditComponent implements OnInit {
  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;
  product!: any;
  category: any = [];
  sizes: any = ["extrasmall", 'medium', 'large', 'extralarge', 'xxl']


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private productService: ProductService,
    private alertService: AlertService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.productForm();
    this.getCategories('menu');
    this.title = 'Create Product';
    if (this.id) {
      // edit mode  
      this.getDataById(this.id)
    }
  }

  get f() { return this.form.controls; }

  productForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      image: [[]],
      category: [null, Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      variants: this.formBuilder.group({
        color: ['red'],
        image: [[]],
        skus: this.formBuilder.group({
          size: ['L'],
          quantity: [20],
          inStock: ["true", Validators.required],
        })
      })
    });
  }

  getDataById(id: any) {
    this.title = 'Edit Product';
    this.loading = true;
    this.productService.getById(id)
      .pipe(first())
      .subscribe(x => {
        this.product = x
        this.form.patchValue(x);
        this.loading = false;
      });
  }

  addVariant() {
    console.log(this.form.value.variants)
  }

  setSelectedFiles(images: string) {
    this.form.controls['image'].setValue(images);
  }

  getCategories(type: any) {
    let val = {
      type: type,
      pattern: "flat"
    }
    this.categoryService.getAllByType(val)
      .pipe(first())
      .subscribe(category => this.category = category);
  }

  onSubmit() {
    console.log(this.form)

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid || this.form.valid) {
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


