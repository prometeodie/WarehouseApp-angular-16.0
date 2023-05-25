import { Injectable, inject  } from '@angular/core';
import {  BehaviorSubject } from 'rxjs';
import { google } from "google-maps";
import { CenterAddres, LatLng } from '../interfaces';
import Swal from 'sweetalert2';
import { environment } from 'src/assets/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private readonly baseUrl: string = environment.baseUrl;
  private route = inject(Router);

  private _place$ = new BehaviorSubject<CenterAddres>({ latLng:{lat:0,lng:0}, addresTitle:'' });

  public get place$() {
    return this._place$;
  }
  public set place$(value) {
    this._place$ = value;
  }


  // to search a place
  setPlaces(place: CenterAddres) {
    this.place$.next(place);
  }

  getPlaces() {
    return this.place$.asObservable();
  }

  constructor() {
  }

  // gets the latitude and longitude from the place that the user has chose
  autoComplete(autoComplete: google.maps.places.Autocomplete):void{

      const placeResponse = autoComplete.getPlace();
      let lat:number = 0;
      let lng:number = 0;
      const text ='Something goes Wrong, please select a correct Addres';

        if(!placeResponse.place_id){
          this.errorMenssageScreen(text);
          this.route.navigateByUrl('dasboard/warehouse-list');
          return;
        }
      lat = placeResponse.geometry?.location.lat()!,
      lng = placeResponse.geometry?.location.lng()!,

        this.setPlaces( { latLng:{lat, lng}, addresTitle:placeResponse.formatted_address! });

  }

  // shows a screen pop-up error when the direction doesn't exist
  errorMenssageScreen(text:string){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: text,
      showConfirmButton: false,
      timer: 2000
    })
  }

}

