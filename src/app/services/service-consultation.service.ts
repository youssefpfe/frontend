import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {ServiceConsultation} from "../common/ServiceConsultation";
import {Consultant} from "../common/Consultant";
import {SignupRequestConsultant} from "../common/user/SignupRequestConsultant";
import {ServiceConsultationRequest} from "../common/ServiceConsultationRequest";
//import {baseUrl} from "../../environments/environment";
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class ServiceConsultationService {
  observer = new Subject();
  public subscriber$ = this.observer.asObservable();
  constructor(private httpClient: HttpClient) { }
  baseUrl= environment.baseUrl;

  getServicesList(): Observable<ServiceConsultation[]> {
    return this.httpClient.get<ServiceConsultation[]>(this.baseUrl + '/RELATIONSHIP-SERVICE/serviceConsultation/getAll',{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });


  }

  delete(id: any) {
    return this.httpClient.delete<string>(this.baseUrl + '/RELATIONSHIP-SERVICE/serviceConsultation/delete/' + id,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    })
  }

  getServiceById(id: any): Observable<ServiceConsultation> {
    return this.httpClient.get<ServiceConsultation>(this.baseUrl + '/RELATIONSHIP-SERVICE/serviceConsultation/get/' + id,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });

  }

  editService(s: ServiceConsultationRequest): Observable<ServiceConsultation> {

    return this.httpClient.put<ServiceConsultation>(this.baseUrl + '/RELATIONSHIP-SERVICE/serviceConsultation/edit/'+s.id, s,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });
  }
  addService(s: ServiceConsultationRequest): Observable<ServiceConsultation> {

    return this.httpClient.post<ServiceConsultation>(this.baseUrl + '/RELATIONSHIP-SERVICE/serviceConsultation/add', s,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });
  }

}
