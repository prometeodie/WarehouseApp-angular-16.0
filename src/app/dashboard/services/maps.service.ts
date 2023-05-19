import { Injectable, inject  } from '@angular/core';
import { Subject } from 'rxjs';
import { google } from "google-maps";
import { Place, Warehouse } from '../interfaces';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/assets/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private place$ = new Subject<Place | null>();
  private http = inject(HttpClient)
  private readonly baseUrl: string = environment.baseUrl;

  setPlaces(place: Place  | null) {
    this.place$.next(place);
  }
  getPlaces() {
    return this.place$.asObservable();
  }

  constructor() {
  }

  getPlacesHttp(){
    return this.http.get<Warehouse[]>(`${this.baseUrl}/warehouses`);
  }

  autoComplete(autoComplete: google.maps.places.Autocomplete):void{
    autoComplete.addListener('place_changed',()=>{

      const placeResponse = autoComplete.getPlace();

        if(!placeResponse.geometry?.location){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Something goes Wrong, please select a correct Addres',
            showConfirmButton: false,
            timer: 2000
          })
          return;
        }
        // The country is always in the last position of this data
      const splitedInformation = placeResponse.formatted_address?.split(',');
      const countryPosition = splitedInformation?.length! -1;

      const place :Place = {
        name: placeResponse.name,
        location: placeResponse.geometry?.location,
        country: splitedInformation![countryPosition],
        formatted_address: placeResponse.formatted_address!,
      };

        this.setPlaces(place);
    })
  }


}
