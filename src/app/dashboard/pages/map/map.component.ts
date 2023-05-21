import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MapsService } from '../../services/maps.service';
import { google } from "google-maps";
import { LatLng } from '../../interfaces';
import { catchError, map } from 'rxjs';

export interface Center {lat:number,lng:number};
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements  OnInit, AfterViewInit {

  @ViewChild('map') map!:ElementRef;
  private  authService = inject(AuthService);
  private  mapsService = inject(MapsService);

  public latLng    : Center = { lat:-37.3238288, lng:-59.1064222}
  public  place    : any= [];
  public warehouses!: LatLng[];

  public maps!: google.maps.Map;
  private distanceMatrixService = new google.maps.DistanceMatrixService();

  constructor() {
      this.authService.checkAuthStatus().subscribe();
    }

    ngOnInit(): void {
     this.mapsService.getPlaces().subscribe(addres =>{ console.log(addres);this.threeClosestWarehouse(addres)})
     this.mapsService.getPlacesHttp().pipe(
      map((warehouses)=> {
        return this.warehouses = warehouses.map(warehouses=>{return warehouses.latLng});
      }),
      catchError(err => {return err})
     ).subscribe();
    }

      ngAfterViewInit(): void {

        const {lat,lng} = this.latLng;

        const options ={
          center   : new google.maps.LatLng(lat, lng),
          zoom     :17,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.maps = new google.maps.Map(this.map.nativeElement, options);
      }


  threeClosestWarehouse(location:LatLng){

      const request = {
        origins     : [location],
        destinations: this.warehouses,
        travelMode  : google.maps.TravelMode.DRIVING,
        unitSystem  : google.maps.UnitSystem.METRIC,
      }

      this.distanceMatrixService.getDistanceMatrix( request, this.callBack );

    }

  callBack(result:any, status:string) {
            if (status === google.maps.DirectionsStatus.OK) {
              console.log('result',result);
            }
    }
}


