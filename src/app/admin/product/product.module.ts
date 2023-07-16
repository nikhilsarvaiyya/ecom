import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { FileUploadComponent } from '@app/_components';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductRoutingModule
],
declarations: [
    ListComponent,
    AddEditComponent,
    FileUploadComponent
],
schemas: [
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
],
})
export class ProductModule { }
