import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()

export class Service {

    constructor(private _htppClient:HttpClient){

    }

    public refreshToken(refresh: string): Observable<void> {
        return this._htppClient.post<void>(`accounts/token/refresh/`, { refresh });
      }
}