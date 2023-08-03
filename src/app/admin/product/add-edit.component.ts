import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService, CategoryService, ProductService } from '@app/_services';
@Component({
  templateUrl: 'add-edit.component.html'
})

export class AddEditComponent implements OnInit {
  form!: FormGroup;
  variantForm!: FormGroup;
  skuForm!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;
  product!: any;
  sizes: any = ["L", "Xl"]
  variantIndex: Number = -1
  skuIndex: Number = -1
  category: any = [];
  newSize: Boolean = true

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private productService: ProductService,
    private alertService: AlertService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getCategories('menu');
    this.productForm();
    this.vf()
    this.sf()


    this.title = 'Create Product';
    if (this.id) {
      // edit mode  
      this.getDataById(this.id);
    }
  }

  get f() { return this.form.controls; }

  productForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      image: [[], Validators.required],
      category: [null, Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      variants: this.fb.array([])
    });
  }

  vf() {
    this.variantForm = this.fb.group({
      color: ['black', Validators.required],
      image: [""],
      skus: this.fb.array([])
    });
  }

  addVariants(color = "", image = "", sku = "") {
    console.log({ color, image, sku })
    let variant = this.form.get('variants') as FormArray;
    variant.push(this.fb.group({
      color: [color],
      image: [image],
      skus: this.fb.array([])
    }));
  }

  onSubmitVariant() {
    this.addVariants(this.variantForm.value.color, this.variantForm.value.image, this.variantForm.value.skus);
    this.onSubmit()
  }

  sf() {
    this.skuForm = this.fb.group({
      size: ["L"],
      quantity: [55],
      inStock: [true]
    });
  }

  addSku(size = "", quantity = '', inStock = true) {
    console.log({ size, quantity, inStock })
    let skus = this.variantForm.get('skus') as FormArray;
    skus.push(this.fb.group({
      size: [size],
      quantity: [quantity],
      inStock: [inStock]

    }));
  }

  onSubmitAdd() {
    console.log("onSubmitAdd", this.skuForm)
    this.addSku(this.skuForm.value.size, this.skuForm.value.quantity, this.skuForm.value.inStock);
    this.onSubmit()
  }

  onSubmitSku() {
    // this.addSku(this.variantForm.value.size,this.variantForm.value.quantity,this.variantForm.value.inStock);
    // this.onSubmit()
  }

  editSku(i: any, j: any) {
    this.variantIndex = i
    this.skuIndex = j
  }

  updateSku() {
    this.variantIndex = -1
    this.skuIndex = -1;
  }

  getDataById(id: any) {
    console.log("load getDataById", this.form)
    this.title = 'Edit Product';
    this.loading = true;
    this.productService.getById(id)
      .subscribe(x => {
        this.product = x
        this.form.patchValue(x);
        console.log({ x })
        this.product?.variants?.forEach((element: any) => {
          this.addVariants(element.color, element.image, element.skus)
          element?.skus?.forEach((item: any) => {
            this.addSku(item?.size, item?.quantity, item?.inStock)
          })
        });

        this.loading = false;
      });
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
    console.log("this.form", this.form)
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
          // this.getDataById(this.id)
          this.submitting = false;
        },
        error: error => {
          this.alertService.error(error);
          this.submitting = false;
        }
      });
  }
}

