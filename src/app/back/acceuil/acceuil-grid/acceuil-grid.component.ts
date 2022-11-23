import { Component, OnInit } from '@angular/core';
import {Utilisateur} from "../../../common/Utilisateur";
import {SalleAttente} from "../../../common/SalleAttente";
import {AuthService} from "../../../shared/auth/auth.service";
import {SalleAttenteService} from "../../../services/salle-attente.service";
import {AcceuilService} from "../../../services/acceuil.service";
import {Accueil} from "../../../common/Accueil";
import {Router} from "@angular/router";
declare var $: any;
@Component({
  selector: 'app-acceuil-grid',
  templateUrl: './acceuil-grid.component.html',
  styleUrls: ['./acceuil-grid.component.css']
})
export class AcceuilGridComponent implements OnInit {
  userInfo?: Utilisateur;

  acceuils: Accueil[] = [];

  constructor(private route : Router,private auth: AuthService, private acceuilService: AcceuilService) {
  }

  ngOnInit(): void {

    this.listAcceuils();
    this.auth.userProfile.subscribe((data) => {
      this.userInfo = data;
    });
    setTimeout(() => {

      $(function () {


        $('#acceuils').DataTable({
          "paging": true,
          "lengthChange": true,
          "searching": true,
          "ordering": true,
          "info": true,
          "autoWidth": true,
          "responsive": true,



          "language": {
            "lengthMenu": "Afficher _MENU_ ",
            "zeroRecords": "Rien Trouver ",
            "info": "Affichage page _PAGE_ de _PAGES_",
            "infoEmpty": "Aucunne information disponible",
            "infoFiltered": "(filtrer de _MAX_ total records)",
            "search": " <div style='margin-right:49%'>Rechercher:</div>",

            "paginate":{
              "previous":"Précédent",
              "next": "Prochain",
              "last":"Dernier",
              "first":"Premier",
            }
          }

        });
      });

    }, 10000);

  }

  listAcceuils() {

    this.acceuilService.getAcceuilList().subscribe(
      (data) => {
        this.acceuils = data;
      },
      () => {
      },
      () => {
      }
    )

  }

  delete(id: any) {

    this.acceuilService.delete(id).subscribe(
      (data) => {
      },
      (error) => {
        setTimeout(()=>{
          if(error.status==401){
            this.route.navigate(['login']);
          };},1000)
      },
      () => {
        this.listAcceuils();
        window.location.reload();
      }
    );

  }
}
