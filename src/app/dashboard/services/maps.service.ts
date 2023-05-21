import { Injectable, inject  } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { google } from "google-maps";
import { LatLng, Place, Warehouse } from '../interfaces';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/assets/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private place$ = new Subject<LatLng>();
  private placeWarehouse$ = new Subject<Place | null>();
  private http = inject(HttpClient)
  private readonly baseUrl: string = environment.baseUrl;

  // to search a place
  setPlaces(place: LatLng) {
    this.place$.next(place);
  }

  getPlaces() {
    return this.place$.asObservable();
  }

  // to add a new warehouse place
  setPlaceWarehouse(place: Place  | null) {
    this.placeWarehouse$.next(place);
  }

  getPlaceWarehouse() {
    return this.placeWarehouse$.asObservable();
  }

  constructor() {
  }

  getPlacesHttp(){
    return this.http.get<Warehouse[]>(`${this.baseUrl}/warehouses`);
  }

  // gets the latitude and longitude from the place that the user has chose
  autoComplete(autoComplete: google.maps.places.Autocomplete):void{


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
// gets the  name, location, country, formatted_address (lat, lng) from the new warehouse's addres form
  autoCompleteWarehouse(autoComplete: google.maps.places.Autocomplete):void{
    autoComplete.addListener('place_changed',()=>{

      const placeResponse = autoComplete.getPlace();

        // The country is always in the last position of this data
      const splitedInformation = placeResponse.formatted_address?.split(',');
      const countryPosition = splitedInformation?.length! -1;
      const text ='Something goes Wrong, please select a correct Addres';
      let lat:number = 0;
      let lng:number = 0;
      let place!:Place;

      if(!placeResponse.geometry?.location){
        this.errorMenssageScreen(text);
        return;
      }
      lat = placeResponse.geometry?.location.lat();
      lng = placeResponse.geometry?.location.lng();
      place  = {
        name: placeResponse.name,
        location: placeResponse.geometry?.location,
        country: splitedInformation![countryPosition],
        formatted_address: placeResponse.formatted_address!,
      };

        this.setPlaceWarehouse(place);
    })
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
