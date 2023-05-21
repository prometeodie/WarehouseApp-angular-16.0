import { Injectable  } from '@angular/core';
import {  BehaviorSubject } from 'rxjs';
import { google } from "google-maps";
import { LatLng } from '../interfaces';
import Swal from 'sweetalert2';
import { environment } from 'src/assets/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MapsService {


  private _place$ = new BehaviorSubject<LatLng>({lat:0,lng:0});
  public get place$() {
    return this._place$;
  }
  public set place$(value) {
    this._place$ = value;
  }

  private readonly baseUrl: string = environment.baseUrl;

  // to search a place
  setPlaces(place: LatLng) {
    this.place$.next(place);
  }

  getPlaces() {
    return this.place$.asObservable();
  }

  constructor() {
  }

  // gets the latitude and longitude from the place that the user has chose
  autoComplete(autoComplete: google.maps.places.Autocomplete):void{
    // autoComplete.addListener('place_changed',()=>{

      const placeResponse = autoComplete.getPlace();
      let lat:number = 0;
      let lng:number = 0;
      const text ='Something goes Wrong, please select a correct Addres';

        if(!placeResponse.geometry?.location){
          this.errorMenssageScreen(text);
          return;
        }
      lat = placeResponse.geometry?.location.lat(),
      lng = placeResponse.geometry?.location.lng(),

        this.setPlaces({lat, lng});

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

