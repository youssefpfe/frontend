import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SalleAttente} from "../common/SalleAttente";
import {Examen} from "../common/Examen";
import {ExamenRequest} from "../common/ExamenRequest";
//import {baseUrl} from "../../environments/environment";
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  observer = new Subject();
  public subscriber$ = this.observer.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  baseUrl= environment.baseUrl;

  getExamenList(): Observable<Examen[]> {
    return this.httpClient.get<Examen[]>(this.baseUrl + '/RELATIONSHIP-SERVICE/examen/getAll', {
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });
  }

  delete(id: any) {
    return this.httpClient.delete<string>(this.baseUrl + '/RELATIONSHIP-SERVICE/examen/delete/' + id,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    })
  }

  getExamenById(id: string|null): Observable<Examen> {
    return this.httpClient.get<Examen>(this.baseUrl + '/RELATIONSHIP-SERVICE/examen/get/' + id,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });

  }

  editExamen(s: Examen): Observable<Examen> {
    console.log(s);
    return this.httpClient.put<Examen>(this.baseUrl + '/RELATIONSHIP-SERVICE/examen/edit/'+s.id, s,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });
  }
  addExamen(s: ExamenRequest): Observable<Examen> {

    return this.httpClient.post<Examen>(this.baseUrl + '/RELATIONSHIP-SERVICE/examen/add',s,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });
  }
}
