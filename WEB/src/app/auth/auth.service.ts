import { HttpResponse, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, map, BehaviorSubject } from 'rxjs';
import environment from '../../enviroments/environment';
import { Auth, LogInAuthUser } from './auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth$ = new BehaviorSubject<Auth | null>(null);

  constructor(private httpClient: HttpClient) { }

  public postLogIn = (loginForm: LogInAuthUser): Observable<any> => {
    return this.httpClient.post<LogInAuthUser>(`${environment.urlBase}session`, loginForm, 
    { observe: 'response' }).pipe(
      map((response: any) => {
        console.log('postLogIn', response);
        return response;
      })
    )
  };
}

