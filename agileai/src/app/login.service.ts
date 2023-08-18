import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

export interface LoginResponse {
  token: string;
  username: string;
  password: string;
}

export interface UserResponse {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = 'http://localhost:3000/login';
  private registerUrl = 'http://localhost:3000/login/register';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  getLogin(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { username, password }, this.httpOptions)
      .pipe(map(response => response));
  }
  register(username: string, password: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.registerUrl, { username, password }, this.httpOptions)
      .pipe(
        catchError(this.handleError<UserResponse>('register'))
      );
  }
y
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // TODO: send the error to remote logging infrastructure
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}

