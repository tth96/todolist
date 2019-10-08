import { Injectable } from '@angular/core';
import { FormAddData } from '../../interface';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError, of } from 'rxjs';

import { catchError, tap , map} from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-type' : 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HttpsService {

  // private dataUrl: string = 'http://localhost:3000/datafake';
  private dataUrl: string = 'https://protected-river-59450.herokuapp.com/todo';
  constructor(private http: HttpClient) {}
  
  // Get Data
  getData(): Observable<FormAddData[]> {
      return this.http.get<FormAddData[]>(this.dataUrl)
      .pipe(
        tap(data => {console.log("Get Success")}),
        catchError(error => of(null))
      )
  }
  
  //Post Data
  postData(newinfo: FormAddData): Observable<FormAddData> {
    return this.http.post<FormAddData>(this.dataUrl,newinfo, httpOptions)
                    .pipe(
                      tap(data => {console.log("Add Success")}),
                      catchError(error => of(null))
                    )
  }

  //Delete data
  deleteData(todoIditem: number): Observable<FormAddData> {
    const url:string = `${this.dataUrl}/${JSON.stringify(todoIditem)}`;
    console.log(url);
    return this.http.delete<any>(url, httpOptions).pipe(
      tap(data => console.log(`data = ${JSON.stringify(data)}`)),
      catchError(error => of(null))
    );
  }

  //Delete All data
  deleteAll():Observable<any>{
    const linkUrl: string = `${this.dataUrl}/all`;
    console.log(`${JSON.stringify(linkUrl)}`);
    return this.http.delete<FormAddData>(linkUrl, httpOptions)
                    .pipe(
                      tap(data => {console.log("Delete All Success")}),
                      catchError(error => of(null))
                    );
  }

  //Delete Select data
  deleteSelect(listtodo: number[]):Observable<any>{
    const list: string = JSON.stringify(listtodo)
    const link: string = `${this.dataUrl}/multiple?listId=${list.slice(1,list.length - 1).replace("-","-")}`;
    console.log(link);
    console.log(JSON.stringify(listtodo));
    // return null;
    return this.http.delete<FormAddData>(link).pipe(
      tap(data => {console.log("DeleteSelect Success")},
      ),
      catchError(error => {console.log(`error`); return of(null)})
    );
  }
  
  //Put Data
  updateData(newdata: FormAddData): Observable<FormAddData> {
    const urlput = `${this.dataUrl}/${JSON.stringify(newdata.todoId)}`;
    console.log(urlput);
    return this.http.put<FormAddData>(urlput, newdata, httpOptions)
                    .pipe(
                    tap(data => console.log("Put success"),
                    ),
                    catchError(error => of(null))
    )
  }
}
