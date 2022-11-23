

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, Input, OnChanges, SimpleChanges, DoCheck,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import {ActivatedRoute} from "@angular/router";
import {PriseRdvService} from "../../services/prise-rdv.service";
import {PriseRdv} from "../../common/PriseRdv";
import {Patient} from "../../common/Patient";
import {PatientService} from "../../services/patient.service";
import {PriseRdvRequest} from "../../common/PriseRdvRequest";
import {FormBuilder, Validators} from "@angular/forms";
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {Consultant} from "../../common/Consultant";
registerLocaleData(localeFr);

import { FlatpickrModule } from 'angularx-flatpickr';
import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr';
import {ExamenService} from "../../services/examen.service";
import {Examen} from "../../common/Examen";
import {ConsultantService} from "../../services/consultant.service";
import {AuthService} from "../../shared/auth/auth.service";
import {Utilisateur} from "../../common/Utilisateur";

export function flatpickrFactory() {
  flatpickr.localize(French);
  return flatpickr;
}




const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
declare var $: any;

@Component({
  selector: 'app-calendrier2',
  templateUrl: './calendrier2.component.html',
  styleUrls: ['./calendrier2.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendrier2Component  implements OnInit,OnChanges{
  @Input() consultantId !: number;

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;


  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];
  add:boolean=false;

  activeDayIsOpen: boolean = true;
  priseRdvs:PriseRdv[]=[];
  patient:Patient=new Patient();
  prise:PriseRdvRequest= new  PriseRdvRequest();
  nomCons!:string;
  prenomCons!:string;
  consultant!:Consultant;


  addprise=this.fb.group({
    motif: ['',[Validators.required,Validators.minLength(4)]],
    date: ['',[Validators.required]],
    examen: ['',[Validators.required]],

    pat: ['',[Validators.required]],
    cons: ['',[Validators.required]],

  })

  locale:string='fr'
  examens:Examen[]=[];

  x:number=0;


  userInfo?: Utilisateur;
  constructor(private fb: FormBuilder,private modal: NgbModal,private activatedroute: ActivatedRoute,private servicePatient:PatientService,private serviceRDV :PriseRdvService,private examenService : ExamenService,private consultantService:ConsultantService,private auth: AuthService) {
    this.userInfo=this.auth.loadUserFromLocalStorage();


  }

  onPageLoading(){
    this.serviceRDV.getAllPriseRdvByConsultant(this.consultantId).subscribe(
      (data) => {
        for(let r of this.priseRdvs){
          //this.consultant=r.consultant;
          this.events.push(
            {
              start: new Date(r.dateRDV),
              title: r.patient.nom+" "+ r.patient.prenom,
              cssClass: r.consultant.nom + " "+r.consultant.prenom,
              id: r.id,
              meta:r.examen.nomExamen,
              actions: this.actions,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              draggable: true,

            }
          )
        }

      },
      () => {
      },
      () => {
      });
  }



  ngOnInit() {
    this.getRdvs(this.userInfo?.id);
    this.getExamens();
    flatpickrFactory();
    this.getConsultant(this.userInfo?.id);


  }
  ngOnChanges(changes: SimpleChanges) {
    this.getConsultant(this.userInfo?.id);
   /* this.activatedroute.paramMap.subscribe((params) => {
      this.getPatient(params.get('id'));});*/
    this.getExamens();
    this.getRdvs(this.userInfo?.id);
    this.events=[{
      title:"blaaaaaaaaaaaaa",
      start:new Date(),
    }];
    this.refresh.next();


      for(let r of this.priseRdvs){
        //this.consultant=r.consultant;
        this.events.push(
          {
            start: new Date(r.dateRDV),
            title: r.patient.nom+" "+ r.patient.prenom,
            cssClass: r.consultant.nom + " "+r.consultant.prenom,
            id:r.id ,
            meta:r.examen.nomExamen,
            actions: this.actions,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,

          }
        )
      }
    this.refresh.next();

    setTimeout(()=>{
      this.prise.patientId=this.patient.id;
      this.prise.consultantId=this.consultantId;
      this.addprise.controls.pat.setValue(this.patient.id.toString());
      this.addprise.controls.cons.setValue(this.consultantId.toString());
      this.refresh.next();
      /*  this.setView(CalendarView.Day);
        $('#fff').events(this.events);*/
    },1000);
  }

  /*getPatient(id:any) {

    this.servicePatient.getPatientById(id).subscribe(
      (data) => {
        this.patient = data
      },
      (error) => {
      }
    );
  }*/

  getRdvs(id :any){
    this.serviceRDV.getAllPriseRdvByConsultant(id).subscribe(
      (data) => {
        this.priseRdvs = data;this.refresh.next();

      },
      () => {
      },
      () => {
      });
  }
  getExamens(){
    this.examenService.getExamenList().subscribe(
      (data) => {
        this.examens = data;this.refresh.next();

      },
      () => {
      },
      () => {
      });
  }

  getConsultant(id:any){
    this.consultantService.getConsultantById(id).subscribe(
      (data)=>{this.consultant=data;this.refresh.next();},
      ()=>{},
      ()=>{}
    )
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        let pr:PriseRdvRequest=new PriseRdvRequest();
        pr.id=event.meta;
        pr.dateRDV=newStart;
        this.serviceRDV.editPriseRdv(pr).subscribe(()=>{

        })
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    //  this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.add=!this.add;
    /*this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];*/
  }

  Add(prise:PriseRdvRequest){
    let p:PriseRdv=new PriseRdv();
    this.serviceRDV.addPriseRdv(prise).subscribe(
      (data)=>{p=data;this.getRdvs(this.consultantId);this.addprise.controls.motif.setValue("");this.addprise.controls.date.setValue("");this.prise.motif="";this.prise.dateRDV=new Date();

      },
      ()=>{

      }
    );
    setTimeout(()=>{
      this.events = [
        ...this.events,
        {
          start: new Date(prise.dateRDV),
          title: this.patient.nom+" "+ this.patient.prenom,
          cssClass:this.consultant.nom + " "+this.consultant.prenom,
          meta: p.examen.nomExamen,

          actions: this.actions,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,

        },

      ];
    },100);



    this.add=!this.add;
  }

  deleteEvent(eventToDelete: CalendarEvent,id:any) {
    this.serviceRDV.delete(this.priseRdvs[id].id).subscribe(
      ()=>{}
    )
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    //this.events=[];
let cc =this.x;
   if(renderEvent.period.events.length==0 && this.x<=2) {


     this.getConsultant(this.userInfo?.id);
     this.getRdvs(this.userInfo?.id);
     cc =1;
     this.x=this.x+1;
     for(let r of this.priseRdvs){
       //this.consultant=r.consultant;

       this.events.push(
         {
           start: new Date(r.dateRDV),
           title: r.patient.nom+" "+ r.patient.prenom,
           cssClass: r.consultant.nom + " "+r.consultant.prenom,
           id:r.patient.id ,
           meta:r.examen.nomExamen,
           actions: this.actions,
           resizable: {
             beforeStart: true,
             afterEnd: true,
           },
           draggable: true,

         }
       );
       this.x=this.x+1;
     }
   }
  }
  refreshView(): void {
    this.refresh.next();
  }
}

