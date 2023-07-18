import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@app/pages/home';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  { path: '',  component: HomeComponent },
  { path: 'product-detail/:id/:name', component: ProductDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
