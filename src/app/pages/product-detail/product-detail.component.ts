import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';


import { ProductService } from '@app/_services';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.less']
})
export class ProductDetailComponent {
  id?: string;
  product: any
  showImage: any;
  noImage: any = '../../assets/img/no-image.png';
  allColorImages:any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      // edit mode
      this.productService.getById(this.id)
        .pipe(first())
        .subscribe(x => {
          this.product = x;

          for (let i = 0; i < this.product?.variants.length; i++) {
            if(this.product?.variants[i]?.image?.length !== 0){
              this.setColorImage(this.product?.variants[i]?.color);
              break;
            } else{
              this.setColorImage(null);
            }
          }
      });
    }
  }

  getUniqueSize(varients: any) {
    let set = [...new Set(varients.map((m: any) => m.skus.map((m: any) => m.size)).flat(1))]
    return Array.from(set)
  }

  getUniqueColor(varients: any) {
    let set = varients.map((m: any) => m.color)
    return set
  }

  setImage(img: any) {
    this.showImage = img
  }

  setColorImage(color:any){
    if(color){
      this.allColorImages = this.product?.variants.filter((clr:any) => clr.color === color)[0]?.image ;
    } else{
      this.allColorImages = this.product?.image ;
    }
   
    this.setImage(this.allColorImages[0])
  }
}
