import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, Observable } from 'rxjs';

import environment from '../../enviroments/environment';
import { AddDialogDebtor } from './add/add.interface';
import { BookingClient } from './calendar/calendar.interfaces';

export interface DataType {
  value: string | number | boolean,
  name: string,
}

export class Doctor {
  text?: string;

  id?: number;

  color?: string;
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

  public getDoctors = (): Doctor[] => {
    return [
      {
        text: 'Dr Brown',
        id: 1,
        color: '#00af2c',
      }, {
        text: 'Dr McGill',
        id: 2,
        color: '#56ca85',
      }, {
        text: 'Dr Stegmann',
        id: 3,
        color: '#8ecd3c',
      },
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
    return this.httpClient.post<AddDialogDebtor>(`${environment.urlBase}clients`, debtorForm, 
    { observe: 'response' }).pipe(
      map((response: HttpResponse<AddDialogDebtor>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public getClient = (clientID: string): Observable<AddDialogDebtor> => {
    return this.httpClient.get<AddDialogDebtor>(`${environment.urlBase}clients`,
    { params: { clientID }, observe: 'response' }).pipe(
      map((response: any) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public putClient = (debtorForm: AddDialogDebtor): Observable<any> => {
    return this.httpClient.put<AddDialogDebtor>(`${environment.urlBase}clients`, debtorForm,
    { observe: 'response' }).pipe(
      map((response: HttpResponse<AddDialogDebtor>) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public deleteClient = (clientID: string): Observable<any> => {
    return this.httpClient.delete<boolean>(`${environment.urlBase}clients`,
    { params: { clientID }, observe: 'response' }).pipe(
      map((response: HttpResponse<boolean>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  };

  public getBookingClients = (): Observable<BookingClient[]> => {
    return this.httpClient.get<BookingClient[]>(`${environment.urlBase}bookings/clientssall`,
    { observe: 'response' }).pipe(
      map((response: any) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public getBookings = (clientID: string): Observable<AddDialogDebtor> => {
    return this.httpClient.get<AddDialogDebtor>(`${environment.urlBase}bookings/bookingsall`,
    { params: { clientID }, observe: 'response' }).pipe(
      map((response: any) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public postBooking = (clientID: string): Observable<AddDialogDebtor> => {
    return this.httpClient.post<AddDialogDebtor>(`${environment.urlBase}bookings`,
    { observe: 'response' }).pipe(
      map((response: any) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public getBooking = (bookingID: string): Observable<AddDialogDebtor> => {
    return this.httpClient.get<AddDialogDebtor>(`${environment.urlBase}bookings`,
    { params: { bookingID }, observe: 'response' }).pipe(
      map((response: any) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public putBookings = (bookingID: string): Observable<AddDialogDebtor> => {
    return this.httpClient.get<AddDialogDebtor>(`${environment.urlBase}bookings`,
    { params: { bookingID }, observe: 'response' }).pipe(
      map((response: any) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public deleteBookings = (bookingID: string): Observable<AddDialogDebtor> => {
    return this.httpClient.get<AddDialogDebtor>(`${environment.urlBase}bookings`,
    { params: { bookingID }, observe: 'response' }).pipe(
      map((response: any) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }
}
