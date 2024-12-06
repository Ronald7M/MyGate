import { Injectable } from '@angular/core';
import {catchError, map, Observable, throwError, timeout} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GenaralService {
  private url:string="http://ronsky.go.ro:1002/api"
  constructor(private http:HttpClient) {}

  post(token:string): Observable<boolean> {
    return this.http.post<boolean>(this.url,{ token });
  }

  getAuth(pass:string): Observable<any> {
    return this.http.post<any>(this.url+"/pass",{ password: pass })
  }
  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.url+"/history")
  }

  get(): Observable<boolean> {
    return this.http.get<any>(this.url, { responseType: 'text' as 'json' }).pipe(
      map(response => this.compare(response))
    ).pipe(
      timeout(3000),
      catchError(this.handleError)
    );
  }

  private compare(str:string):boolean{
    if(str==="true"){
      return true;
    }else{
      return false;
    }
  }
  private handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      console.error('A apărut o eroare:', error.error.message);
    } else {

      console.error(`Cod eroare: ${error.status}, mesaj: ${error.message}`);
    }
    return throwError('Ceva nu a mers, te rog încearcă din nou mai târziu.');
  }
}
