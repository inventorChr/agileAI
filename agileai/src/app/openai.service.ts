import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private apiURL = 'http://localhost:3000/openai';  // replace with your Node.js server address

  constructor(private http: HttpClient) { }

  processIdea(idea: string): Observable<any> {
    return this.http.post(`${this.apiURL}/openai/process`, { idea });
  }
}
