import { HttpResponse, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, map, BehaviorSubject } from 'rxjs';
import { DateTime } from 'luxon';
import { Router } from '@angular/router';

import environment from '../../enviroments/environment';
import { User, LogInAuthUser } from './auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  private tokenExpirationTimer: any;
  constructor(private httpClient: HttpClient, private router: Router) { }

  public postLogIn = (loginForm: LogInAuthUser): Observable<any> => {
    return this.httpClient.post<LogInAuthUser>(`${environment.urlBase}auth/login`, loginForm, 
    { observe: 'response' }).pipe(
      tap((response: HttpResponse<LogInAuthUser>) => {
        return response.status;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  };

  public postRegister = (loginForm: LogInAuthUser): Observable<any> => {
    return this.httpClient.post<LogInAuthUser>(`${environment.urlBase}auth/register`, loginForm, 
    { observe: 'response' }).pipe(
      map((response: HttpResponse<LogInAuthUser>) => {
        const {
          username,
          jwtToken,
          expiresIn,
        } = response.body!;
        this.handleAuthentication(username, jwtToken,  expiresIn);
        return response.status;
      }),
      catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
    );
  };

  public handleAuthentication = (
    userName: string, 
    jwtToken: string,
    expiresIn: number,
  ) => {
    const expirationDate = DateTime.fromMillis(expiresIn);
    const user = new User(userName, jwtToken, expirationDate);
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
      this.postLogOut();
    }, expirationDuration);
  }

  public postLogOut = (): void => {
    this.user$.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('authData');
    localStorage.removeItem('userInfo');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  };
}

