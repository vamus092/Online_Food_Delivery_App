 
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError, switchMap, BehaviorSubject, filter, take } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './services/user-service';
 
// 1. Create state variables outside the interceptor function
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);
 
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const router = inject(Router);
 
  // 2. Safety Check: Don't intercept the refresh request itself, or you risk an infinite loop!
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }
 
  // 3. Grab the token and clone the request normally
  const token = userService.getToken();
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
 
  // 4. Send the request
  return next(authReq).pipe(
    catchError((error) => {
      // Check for the specific 401 error
      if (error.status === 401 && error.error?.message === 'Token expired!') {
       
        // SCENARIO A: We are NOT currently refreshing. This request is the "Leader".
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null); // Reset the waiting room
 
          return userService.getRefreshToken().pipe(
            switchMap((res: any) => {
              isRefreshing = false;
             
              if (res && res.token) {
                sessionStorage.setItem('token', res.token);
               
                // Tell the waiting room the new token is here!
                refreshTokenSubject.next(res.token);
               
                // Retry the original request
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.token}` }
                });
                return next(retryReq);
              }
              return throwError(() => new Error('Refresh failed'));
            }),
            catchError((refreshErr) => {
              // Refresh failed entirely. Wipe session and kick out.
              isRefreshing = false;
              sessionStorage.clear();
              router.navigate(['/login']);
              return throwError(() => refreshErr);
            })
          );
        }
        // SCENARIO B: A refresh is ALREADY happening. This request must "Wait".
        else {
          return refreshTokenSubject.pipe(
            filter(newToken => newToken !== null), // Wait until the token isn't null
            take(1),                               // Take the first new token that arrives, then unsubscribe
            switchMap((newToken) => {
              // The new token arrived! Retry this specific request.
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retryReq);
            })
          );
        }
      }
     
      // If it's a different error (e.g., 404, 500), just throw it normally
      return throwError(() => error);
    })
  );
};
