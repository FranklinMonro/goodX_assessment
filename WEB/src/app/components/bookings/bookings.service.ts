import { HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, catchError, map, tap } from 'rxjs';

import { Appointment } from '../calendar/calendar.models';
import { BookingClient } from '../users/users.model';

import { environment } from '../../../environments/environment';

fetch(environment.apiUrl);
export class Doctor {
  text?: string;

  id?: number;

  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  private readonly httpClient: HttpClient = inject(HttpClient);

  public getBookingClients = (): Observable<any> => {
    return this.httpClient.get<BookingClient[]>(`${environment.apiUrl}bookings/clientssall`,
    { observe: 'response' }).pipe(
      tap((response: HttpResponse<BookingClient[]>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public getBookings = (): Observable<any> => {
    return this.httpClient.get<Appointment[]>(`${environment.apiUrl}bookings/bookingsall`,
    { observe: 'response' }).pipe(
      map((response: HttpResponse<Appointment[]>) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public postBooking = (appointmendData: Appointment): Observable<any> => {
    return this.httpClient.post<Appointment>(`${environment.apiUrl}bookings`, appointmendData,
    { observe: 'response' }).pipe(
      map((response: HttpResponse<Appointment>) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public getBooking = (bookingID: string): Observable<any> => {
    return this.httpClient.get<Appointment>(`${environment.apiUrl}bookings`,
    { params: { bookingID }, observe: 'response' }).pipe(
      map((response: HttpResponse<Appointment>) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public putBookings = (bookingID: string): Observable<any> => {
    return this.httpClient.get<Appointment>(`${environment.apiUrl}bookings`,
    { params: { bookingID }, observe: 'response' }).pipe(
      map((response: HttpResponse<Appointment>) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }

  public deleteBookings = (bookingID: string): Observable<any> => {
    return this.httpClient.get<Appointment>(`${environment.apiUrl}bookings`,
    { params: { bookingID }, observe: 'response' }).pipe(
      map((response: HttpResponse<Appointment>) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  }
}
