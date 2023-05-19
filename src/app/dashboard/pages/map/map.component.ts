import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MapsService } from '../../services/maps.service';
import { google } from "google-maps";
import { Place, Warehouse } from '../../interfaces';

export interface Center {lat:number,lng:number};
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent
{
  @ViewChild('map') map!:ElementRef;
  private  authService = inject(AuthService);
  private  mapsService = inject(MapsService);

  public latLng: Center = { lat:-37.3238288, lng:-59.1064222}
  public  place: any= [];
  public warehouses: Warehouse[] = [];

  public maps!: google.maps.Map;
  private autoComplete:  google.maps.places.Autocomplete | undefined;
  private directionServices = new google.maps.DirectionsService();

  constructor() {
      this.authService.checkAuthStatus().subscribe();
    }

    ngOnInit(): void {
      this.mapsService.getPlaces().subscribe(console.log);
      this.mapsService.getPlacesHttp().subscribe(warehouses => {this.warehouses = warehouses;});
      this.mapsService.getPlaces().subscribe(place =>{console.log('getPlaces', place);this.threeClosestWarehouse(place)})
      }

      ngAfterViewInit(): void {

        const {lat,lng} = this.latLng;

        const options ={
          center: new google.maps.LatLng(lat, lng),
          zoom :17,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.maps = new google.maps.Map(this.map.nativeElement, options);
      }

  ngOnDestroy(): void {
    this.mapsService.setPlaces(null);
  }

  threeClosestWarehouse(place:Place | null){
    const warehouseLatLng = this.warehouses.map((warehouse)=>{return warehouse.latLng});
    const request = {
      origin: place!.location.toString(),
      destination: warehouseLatLng.toString(),
      travelMode:google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
    }

    this.directionServices.route(request, function (result, status) {
      console.log('goog Status:',google.maps.DirectionsStatus.OK)
          if (status == google.maps.DirectionsStatus.OK) {
            console.log('result',result);
          }
  })



}
}


