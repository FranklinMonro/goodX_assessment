import { HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, tap, catchError, map, BehaviorSubject } from 'rxjs';

import { AddDialogDebtor } from './users.model';

import { environment } from '../../../environments/environment';
import { DataType } from './add-dialog/add-dialog.component';

fetch(environment.apiUrl);

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  private readonly httpClient: HttpClient = inject(HttpClient);

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
    return this.httpClient.get<AddDialogDebtor[]>(`${environment.apiUrl}clients/debtorsall`, 
    { observe: 'response' }).pipe(
      map((response: HttpResponse<AddDialogDebtor[]>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public postNewDebtor = (debtorForm: AddDialogDebtor): Observable<any> => {
    return this.httpClient.post<AddDialogDebtor>(`${environment.apiUrl}clients`, debtorForm, 
    { observe: 'response' }).pipe(
      map((response: HttpResponse<AddDialogDebtor>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public getClient = (clientID: string): Observable<any> => {
    return this.httpClient.get<AddDialogDebtor>(`${environment.apiUrl}clients`,
    { params: { clientID }, observe: 'response' }).pipe(
      map((response: HttpResponse<AddDialogDebtor>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public putClient = (debtorForm: AddDialogDebtor): Observable<any> => {
    return this.httpClient.put<AddDialogDebtor>(`${environment.apiUrl}clients`, debtorForm,
    { observe: 'response' }).pipe(
      map((response: HttpResponse<AddDialogDebtor>) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public deleteClient = (clientID: string): Observable<any> => {
    return this.httpClient.delete<boolean>(`${environment.apiUrl}clients`,
    { params: { clientID }, observe: 'response' }).pipe(
      map((response: HttpResponse<boolean>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  };
}
