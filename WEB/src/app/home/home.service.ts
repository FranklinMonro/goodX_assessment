import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, Observable } from 'rxjs';

import environment from '../../enviroments/environment';
import { AddDialogDebtor } from './add/add.interface';

export interface DataType {
  value: string | number | boolean,
  name: string,
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { }

  public getRelaitionshipOptions = (): DataType[] => {
    return [
      { value: 'Husband', name: 'Husband' },
      { value: 'Wife', name: 'Wife' },
      { value: 'Son', name: 'Son' },
      { value: 'Daughter', name: 'Daughter' },
    ];
  };

  public getMainOptions = (): DataType[] => {
    return [
      { value: true, name: 'Yes' },
      { value: false, name: 'No' },
    ];
  };

  public postNewDebtor = (debtorForm: AddDialogDebtor): Observable<any> => {
    return this.httpClient.post<AddDialogDebtor>(`${environment.urlBase}auth/register`, debtorForm, 
    { observe: 'response' }).pipe(
      map((response: HttpResponse<AddDialogDebtor>) => {
        return response.status;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }
}
