import { Injectable } from "@angular/core";

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

import { CookieService } from "ngx-cookie-service";


import { Observable } from "rxjs";
import { environment } from "src/environments/environment";




@Injectable()

export class ApiInterceptor implements HttpInterceptor {
    public ru = "ru"
    constructor(
        private _cookieService: CookieService,
  

    ) {

    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this._cookieService.get('accessToken');
        let headers = req.headers;

        if (accessToken) {
   
            headers = headers.append('Authorization', 'Bearer ' + accessToken,);

 
        }
        console.log(headers)
        const contentType = headers.get('Accept');
        if (!contentType) {
            headers = headers.append('Accept', 'application/json');
        }
        const isFullPath =
            req.url.startsWith('/assets/')
            || req.url.startsWith('http://')
            || req.url.startsWith('https://');
        const clonedReq = req.clone({
            headers,
            url: !isFullPath ? `${environment.apiURL}${req.url}` : req.url,
        });
        return next.handle(clonedReq)
    }
}