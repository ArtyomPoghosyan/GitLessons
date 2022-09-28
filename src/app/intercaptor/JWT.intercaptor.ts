
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { catchError, filter, map, switchMap, take, tap } from "rxjs/operators";

import { NzMessageService } from "ng-zorro-antd/message";

import { environment } from "src/environments/environment";



@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

    private _updateTokenEvent$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _updateTokenState: Observable<boolean>;

    constructor(
        private _cookieService: CookieService,
        private _router: Router,

        private _messageService: NzMessageService,

        private _NzMessageService: NzMessageService,

        private _htppClient:HttpClient
    ) {
        this._updateTokenState = this._updateTokenEvent$.asObservable();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                catchError((err) => {
                    const status: number = (err && err.status) ? err.status : 0;
                    const error = err.error && (err && err.error) ? err.error : null;
                    console.log(error)
                    console.log(status);

                    if (error.detail == "No active account found with the given credentials") {
                  
                    }

                    if (status === 403) {
                      
                        
                    }

                    if (((status === 401) || error.status === 401) && req.url === `${environment.apiURL}accounts/token/refresh/`) {
                        this._router.navigate(['/auth/login']);

                        return throwError(err);
                    }
                    if (status === 401 || error.status === 401) {
                        this.refreshToken();
                        return this._updateTokenState
                            .pipe(
                                filter(token => token != null),
                                take(1),
                                switchMap(() => {
                                    const clonedReq = req.clone({
                                        headers: this.addTokenHeader(req)
                                    })
                                    return next.handle(clonedReq);
                                }),
                            )
                    }
                    return throwError(err);
                })
            );
    }

    private refreshToken(): void {
        let params = new HttpParams();
        let headers = new HttpHeaders();
        const refreshToken: string = this._cookieService.get('refreshToken');
        params = params.set('authorization', 'false');
        if (refreshToken) {
            headers = headers.append('Authorization', 'Bearer ' + this._cookieService.get('refreshToken'));
            // this._baseApiService.auth.refreshToken(refreshToken)
            this.refreshTokens(refreshToken)
            
                .pipe(
                    map((data) => {
                        console.log(data);

                        // const token = data['access'];
                        // this._cookieService.set('accessToken', token,-1, '/');
                        this._updateTokenEvent$.next(true);
                    }),
                    catchError((err) => {
                        this._router.navigate(['/auth/login']);
                        this._updateTokenEvent$.next(false);
                        return throwError(false);
                    })

                )
                .subscribe((_) => { });
        }
        else {
            this._router.navigate(['/auth/login']);
        }
    }
    private addTokenHeader(request: HttpRequest<any>): HttpHeaders {
        let httpHeaders: HttpHeaders = request.headers;
        httpHeaders = httpHeaders.delete('Authorization');
        httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + this._cookieService.get('accessToken'))
        return httpHeaders;
    }

    public refreshTokens(refresh:string){
        return this._htppClient.post(`accounts/token/refresh/`, {refresh})
      }



}
