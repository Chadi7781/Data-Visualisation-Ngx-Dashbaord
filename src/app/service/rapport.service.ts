import { Injectable } from '@angular/core';
import {Rapport} from "../pages/rapport";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RapportService {


  private baseUrl = environment.urlBackend+'rapport';

  constructor(private http: HttpClient) { }




  getRapportList(): Observable<Rapport[]> {
    return this.http.get<Rapport[]>(`${this.baseUrl}`);
  }
}
