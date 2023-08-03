﻿// System Imports
import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// used to create fake backend
// import { fakeBackendProvider } from './_helpers';

// Comman Services / Modules / Pipes

import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AccountService } from './_services';
import { PagesModule } from './pages/pages.module';
import { AppRoutingModule } from './app-routing.module';
import { UniqueWordFromArrayPipe } from './_pipe/unique-word-from-array.pipe';

// Comman Components
import { AppComponent } from './app.component';
import { AlertComponent,PageNotFoundComponent,TreeComponent } from './_components';
import { HomeComponent } from './pages/home';
import { HeaderComponent } from './layout/header/header.component';
import { AvatarComponent } from './_components/avatar/avatar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FormGroupPipe } from './_pipe/form-group.pipe';

//-----------------------------------------------------------------------------------------------

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule,
        NoopAnimationsModule,
        PagesModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        HeaderComponent,
        PageNotFoundComponent,
        AvatarComponent,
        UniqueWordFromArrayPipe,
        FooterComponent,
        FormGroupPipe,
        //TreeComponent
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        // fakeBackendProvider
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }