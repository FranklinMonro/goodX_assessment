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

  public getDebtorAll = (): Observable<any> => {
    return this.httpClient.get<AddDialogDebtor[]>(`${environment.urlBase}clients/debtorsall`, 
    { observe: 'response' }).pipe(
      map((response: HttpResponse<AddDialogDebtor[]>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public postNewDebtor = (debtorForm: AddDialogDebtor): Observable<any> => {
    return this.httpClient.post<AddDialogDebtor>(`${environment.urlBase}clients/debtor`, debtorForm, 
    { observe: 'response' }).pipe(
      map((response: HttpResponse<AddDialogDebtor>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public getClient = (clientID: string): Observable<AddDialogDebtor> => {
    return this.httpClient.get<AddDialogDebtor>(`${environment.urlBase}clients/debtor`,
    { params: { clientID }, observe: 'response' }).pipe(
      map((response: any) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public putClient = (debtorForm: AddDialogDebtor): Observable<any> => {
    return this.httpClient.put<AddDialogDebtor>(`${environment.urlBase}clients/debtor`, debtorForm,
    { observe: 'response' }).pipe(
      map((response: HttpResponse<AddDialogDebtor>) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public deleteClient = (clientID: string): Observable<any> => {
    return this.httpClient.delete<boolean>(`${environment.urlBase}clients/debtor`,
    { params: { clientID }, observe: 'response' }).pipe(
      map((response: HttpResponse<boolean>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }
}
