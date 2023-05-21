import { Component, AfterViewInit, inject, ViewChild, ElementRef  } from '@angular/core';
import { google } from "google-maps";
import { MapsService } from '../../services/maps.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';

export  interface SideNavItems{
  label:string;
  roles:string[]
  icon:string;
  url:string;
}
@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss']
})
export class LayoutPageComponent implements   AfterViewInit {



  private  mapsService = inject(MapsService);
  private autoComplete:  google.maps.places.Autocomplete | undefined;
  public place: any= [];
  private router = inject(Router);
   @ViewChild('inpuField') inpuField!:ElementRef;

  ngAfterViewInit(): void {
    this.autoComplete = new google.maps.places.Autocomplete(this.inpuField.nativeElement);
    this.mapsService.autoComplete(this.autoComplete);
    }

  navigateToMap(){
    this.mapsService.getPlaces()
    .pipe(
      map((resp)=>{
        if(!resp){return;};
        this.router.navigateByUrl('dashboard/map');})
    ).subscribe();
  }

  resetInput(){
    this.inpuField.nativeElement.value ='';
  }


}
