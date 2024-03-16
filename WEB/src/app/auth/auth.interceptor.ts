import { Injectable } from '@angular/core';
import { 
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';

import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // return this.authService.user.pipe(
    //   take(1),
    //   exhaustMap((user) => {
    //     if (!user) {
    //       return next.handle(request);
    //     }
    //     const modifiedRequest = request.clone({
    //       headers: new HttpHeaders().set('X-Authorization', user?.token!),
    //     });
    //     return next.handle(modifiedRequest);
    //   }),
    // );
    return next.handle(request);
  }
}