import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public form!:FormGroup;

  title = 'soundCloud';
  public list: any
  public obj: any[] = []
  public bigger: any[] = []
  public array: any[] = [
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ]
  constructor(
    private http: HttpClient,
    public _fb:FormBuilder,
    public cookieService:CookieService
  ) {

  }

  public ngOnInit(): void {
    this.formInIt()
    this.list = this.getID()

    this.obj.push({ id: "tyo" })
    // console.log(list)
    //  o.subscribe(item=>console.log(item))
    // o.subscribe((resp:any) => {
    //   console.log(resp.id,"444")
    //   this.obj.push(resp)

    // })

    // o.subscribe((resp:any) => {
    //   console.log(resp,"555")
    //   // this.list.push(resp)
    //  this.obj.push(resp);

    // })

  }

  public formInIt(){
    this.form=this._fb.group({
      email:["hakobhakobyan157@gmail.com"],
      password:["Vahe14.24"]
    })
  }

  public login(){
    this.http.post('https://dev.api.lightcore.io/auth/login',this.form.value)
    .subscribe((resp:any)=>{
      console.log(resp)
      if(resp.data.access_token){
        console.log(this.cookieService)
        console.log("hello world")
        this.cookieService.set("accessToken",resp.data['access_token'])
      }
    })
  }

  public getID(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/todos/1')
      .pipe(
        shareReplay()
      )
  }


  public add() {
    this.array = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 5 }
    ]
  }

  public trackByIDs(index: any, item: any) {
    return index
  }

}
