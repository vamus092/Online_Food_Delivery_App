import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8000';
 
  constructor(private http: HttpClient, private router: Router) { }
 
  // --- SESSION HELPERS ---
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
 
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
 
  // --- API CALLS ---
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }
 
  loginUser(formData: any): Observable<any> {
    console.log("Inside user service login ...", formData);
    return this.http.post(`${this.apiUrl}/auth/login`, formData).pipe(
      tap((res: any) => {
        // Save BOTH tokens to sessionStorage
        if (res.token) {
          sessionStorage.setItem('token', res.token);
          if (res.refreshToken) {
            sessionStorage.setItem('refreshToken', res.refreshToken);
          }
         
          const userData = res.data || res.user;
          if (userData) {
            sessionStorage.setItem('userData', JSON.stringify(userData));
          }
        }
      })
    );
  }
 
  getUserProfile(): Observable<any> {
    console.log("Inside user service Get Profile ...");
    // REMOVED {withCredentials: true}. The Interceptor handles auth now.
    return this.http.get(`${this.apiUrl}/auth/profile`);
  }
 
  updateUser(userId: string | undefined, formData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/edit/${userId}`, formData);
  }
 
  logoutUser(): Observable<any> {
    console.log("Inside user service Logout ...");
    const token = this.getToken();
   
    // 1. Immediately clear the frontend session
    sessionStorage.clear();
 
    // 2. Tell the backend to blacklist the token (if it exists)
    if (token) {
      return this.http.post(`${this.apiUrl}/auth/logout`, {});
    }
   
    return of({ success: true });
  }
 
  getRefreshToken(): Observable<any> {
    // Grab the refresh token from session storage and send it in the body
    const refreshToken = sessionStorage.getItem('refreshToken');
    return this.http.post(`${this.apiUrl}/auth/refresh`, { refreshToken });
  }
}
