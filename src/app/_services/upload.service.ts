import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Product } from '@app/_models';

const baseUrl = `${environment.apiUrl}/upload-file`;

@Injectable({ providedIn: 'root' })
export class UploadService {

    constructor(private http: HttpClient) { }

    uploadImages(vals: any): Observable<any> {
        return this.http.post(baseUrl, vals);
    }


}