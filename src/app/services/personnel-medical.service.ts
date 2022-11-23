import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Consultant} from "../common/Consultant";
import {SignupRequestConsultant} from "../common/user/SignupRequestConsultant";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SignupRequestPersonnelMedical} from "../common/user/SignupRequestPersonnelMedical";
import {PersonnelMedical} from "../common/PersonnelMedical";
//import {baseUrl} from "../../environments/environment";
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class PersonnelMedicalService {

  observer = new Subject();
  public subscriber$ = this.observer.asObservable();
  constructor(private httpClient: HttpClient) { }
  baseUrl= environment.baseUrl;

  getPersonnelsList(): Observable<PersonnelMedical[]> {
    return this.httpClient.get<PersonnelMedical[]>(this.baseUrl + '/RELATIONSHIP-SERVICE/utilisateur/Personnel/getAll',{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })

    });
  }



  delete(id: any) {
    return this.httpClient.delete<string>(this.baseUrl + '/RELATIONSHIP-SERVICE/utilisateur/delete/' + id,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })

    })
  }

  getPersonnelById(id: string|null): Observable<PersonnelMedical> {
    return this.httpClient.get<PersonnelMedical>(this.baseUrl + '/RELATIONSHIP-SERVICE/utilisateur/getPersonnelMedical/' + id,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });

  }

  editPersonnel(p: PersonnelMedical): Observable<PersonnelMedical> {

    return this.httpClient.put<PersonnelMedical>(this.baseUrl + '/RELATIONSHIP-SERVICE/utilisateur/edit/Personnel', p,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });
  }
  addPersonnel(p: SignupRequestPersonnelMedical): Observable<PersonnelMedical> {

    return this.httpClient.post<PersonnelMedical>(this.baseUrl + '/RELATIONSHIP-SERVICE/api/auth/PersonnelMedical/signup', p,{
      withCredentials: true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin':'*'
      })
    });
  }
}
