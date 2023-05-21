import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MapsService } from '../../services/maps.service';
import { google } from "google-maps";
import { FixedWarehouses, LatLng, Row, Warehouse, WarehousesDistance } from '../../interfaces';
import { catchError, map } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';


export interface Center {lat:number,lng:number};
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements  OnInit, AfterViewInit {

  @ViewChild('map') map!:ElementRef;
  private  authService      = inject(AuthService);
  private  mapsService      = inject(MapsService);
  private  dashboardService = inject(DashboardService);
  public distanceMatrixPromise:any;

  public latLng     : Center = { lat:-37.3238288, lng:-59.1064222}
  public  place     : any= [];
  public warehouses!: LatLng[];

  public maps!      : google.maps.Map;
  private distanceMatrixService = new google.maps.DistanceMatrixService();

  constructor() {
      this.authService.checkAuthStatus().subscribe();
    }

    ngOnInit(): void {

      this.dashboardService.getWarehouse().pipe(
       map((warehouses)=> {
         this.mapsService.getPlaces().subscribe(addres =>{ this.ClosestWarehouses(addres,warehouses) })
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

  ClosestWarehouses(location:LatLng, warehouses:Warehouse[]){
    const{lat, lng}=location;
    if(lat === 0 && lng === 0) return;
      const warehousesLocation:LatLng[] = warehouses.map(warehouses=>{return warehouses.latLng});

      const request = {
        origins     : [location],
        destinations: warehousesLocation,
        travelMode  : google.maps.TravelMode.DRIVING,
        unitSystem  : google.maps.UnitSystem.METRIC,
      }

      this.distanceMatrixPromise = this.distanceMatrixService.getDistanceMatrix( request,()=>{return})
      this.distanceMatrixPromise.then((distances:WarehousesDistance)=> {

        this.sortClosestWarehouses(this.fixAddreses(distances,warehouses))

      } );
    }

 fixAddreses(distance:WarehousesDistance, warehouses:Warehouse[]){
  // note: google response has an margin error with the adress, this method fix that issue
  // using the addres saved the warehouse response.

    return warehouses.map((warehouse,i)=>{

      return {
              name     : warehouse.name,
              addres   : warehouse.addres,
              latLng   : warehouse.latLng,
              distance : {...distance.rows[0]?.elements[i].distance},
              duration : {...distance.rows[0]?.elements[i].duration},
              status   : distance.rows[0].elements[i].status
                }
    }).filter( resp=> resp.status === 'OK');
 }


 sortClosestWarehouses(warehouses:FixedWarehouses[]){
  const warehouseAmount = 3;
  console.log('sortedWarehouses',warehouses.sort((a,b)=>{ return a.distance!.value - b.distance!.value }).slice(0,warehouseAmount))

 }

}


