import { HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, tap, catchError, map, BehaviorSubject } from 'rxjs';
import { DateTime } from 'luxon';

import { User, LogInAuthUser } from './auth.models';

import { environment } from '../../../environments/environment';

fetch(environment.apiUrl);
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new BehaviorSubject<User | null>(null);

  private tokenExpirationTimer: any;

  private readonly httpClient: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  public postLogIn = (loginForm: LogInAuthUser): Observable<any> => {
    return this.httpClient.post<LogInAuthUser>(`${environment.apiUrl}auth/login`, loginForm, 
    { observe: 'response' }).pipe(
      tap((response: HttpResponse<LogInAuthUser>) => {
        const {
          username,
          jwtToken,
          expiresIn,
        } = response.body!;
        this.handleAuthentication(username, jwtToken,  expiresIn);
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  };

  public postRegister = (loginForm: LogInAuthUser): Observable<any> => {
    return this.httpClient.post<LogInAuthUser>(`${environment.apiUrl}auth/register`, loginForm, 
    { observe: 'response' }).pipe(
      map((response: HttpResponse<LogInAuthUser>) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  };

  public handleAuthentication = (
    username: string, 
    jwtToken: string,
    expiresIn: number,
  ) => {
    const expirationDate = DateTime.fromMillis(expiresIn);
    const user = new User(username, jwtToken, expirationDate);
    this.user$.next(user);
    this.autoLogOut(expiresIn);
    localStorage.setItem('authData', JSON.stringify(user));
  };

  public autoLogin = (): void => {
    const userData: {
    userName: string, 
    _token: string,
    _tokenExpirationDate: DateTime,
    } = JSON.parse(localStorage.getItem('authData')!);
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.userName,  
      userData._token, 
      userData._tokenExpirationDate,
    );

    if (loadedUser.token) {
      this.user$.next(loadedUser);
      const expirationDifference = DateTime.fromISO(userData._tokenExpirationDate.toLocaleString()).diff(DateTime.now()).toMillis();
      this.autoLogOut(expirationDifference);
    }
  }

  public autoLogOut = (expirationDuration: number): void => {
    this.tokenExpirationTimer = setTimeout(() => {
      // this.postLogOut();
    }, expirationDuration);
  }

  public postLogOut = (): void => {
    this.user$.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('authData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  };
}
