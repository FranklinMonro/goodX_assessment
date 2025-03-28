import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { take, exhaustMap } from 'rxjs';
import { AuthService } from './auth.service';

export const authenticateInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService); 

  return authService.user$.pipe(
    take(1),
    exhaustMap((user) => {
      if (!user) {
        return next(req);
      }
      const modifiedRequest = req.clone({
        setHeaders: { 
          'X-Authorization': user.token!, 
        },
      });
      return next(modifiedRequest);
    }),
  );
};
