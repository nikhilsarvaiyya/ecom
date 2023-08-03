import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import { TreeComponent } from '@app/_components';
import { FormGroupPipe } from '@app/_pipe/form-group.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoryRoutingModule,
    MatInputModule,
    MatAutocompleteModule,
    
],
declarations: [
    ListComponent,
    AddEditComponent,
    TreeComponent,
    FormGroupPipe
    
],
schemas: [
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
],
})
export class CategoryModule { }
