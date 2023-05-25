import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MapsService } from '../../services/maps.service';
import { google } from "google-maps";
import { CenterAddres, FixedWarehouses, LatLng, Marker, Warehouse, WarehousesDistance } from '../../interfaces';
import { catchError, map } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements  OnInit  {

  @ViewChild('map') map!:ElementRef;
  private  authService      = inject(AuthService);
  private  mapsService      = inject(MapsService);
  private  dashboardService = inject(DashboardService);

  public distanceMatrixPromise:any;
  private closestWarehouses!: FixedWarehouses[];
  public placeResponse! :LatLng;
  public isMapLoaded = true;
  public addres!    : CenterAddres;
  public warehouses!: LatLng[];
  public bounds = new google.maps.LatLngBounds();


  public maps!      : google.maps.Map;
  private distanceMatrixService = new google.maps.DistanceMatrixService();
  // TODO:borrar
  private directionsRenderer!:  google.maps.DirectionsRenderer;
  private directionsService !:  google.maps.DirectionsService;

  constructor() {
      this.authService.checkAuthStatus().subscribe();

    }
    ngOnInit(): void {

      this.directionsService = new   google.maps.DirectionsService();
      this.directionsRenderer = new   google.maps.DirectionsRenderer();

      this.dashboardService.getWarehouse().pipe(
       map((warehouses)=> {
        this.mapsService.getPlaces().subscribe(addres =>{

          this.addres = addres;
          this.placeResponse = addres.latLng;
          this.ClosestWarehouses(addres.latLng,warehouses)
          this.initMap();

        })
       }),
       catchError(err => {return err})
      ).subscribe();

    }

  initMap(){

        const {lat,lng} = this.addres.latLng;

        const options ={
          center   : new google.maps.LatLng(lat, lng),
          zoom     :17,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.maps = new google.maps.Map(this.map.nativeElement, options);
        // marker for the User's location
       const marker ={
          position: this.addres.latLng,
          map: this.maps,
          title: this.addres.addresTitle
        }
         this.addMarker(marker);

        this.fitBoundMarkers(this.addres.latLng)

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

        this.closestWarehouses = this.sortClosestWarehouses(this.fixAddreses(distances,warehouses))
        this.isMapLoaded = true;
        this.renderMarkers(this.closestWarehouses);
        this.polyline(this.addres,this.closestWarehouses[0]);
      } );
    }

 fixAddreses(distance:WarehousesDistance, warehouses:Warehouse[]){
  // note: google's response has an margin error with the adress, this method fix that issue
  // using the address saved in the warehouse response.

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

// sort and slice warehouse's array
 sortClosestWarehouses(warehouses:FixedWarehouses[]){
  const warehouseAmount = 3;
  return warehouses.sort((a,b)=>{ return a.distance!.value - b.distance!.value }).slice(0,warehouseAmount);
 }

//  set a marker
 addMarker(marker:Marker){
  return new google.maps.Marker({
    position: marker.position,
    label: marker.label,
    map: this.maps,
    title: marker.title
  })
 }

//  transform and warehouse aareay in a marker's array and add the Markers
 renderMarkers(warehouses:FixedWarehouses[]) {

  let markers!:Marker[];

  markers =  warehouses.map((warehouse,i)=>{
    const title: string = `Name: ${warehouse.name}, Addres: ${warehouse.addres}`;
    const label = (i+1).toString();

    this.fitBoundMarkers(warehouse.latLng!)
    return {
      position: warehouse.latLng!,
      label,
      title
     }
  })

   markers.forEach((marker,i) => {
    this.addMarker(marker);
  });
}

  fitBoundMarkers(warehouseLatLng:LatLng){
      this.bounds.extend(warehouseLatLng)
      this.maps.fitBounds(this.bounds)
  }

  polyline(origin:CenterAddres, destination:FixedWarehouses){
    let request ={
      origin: origin.latLng,
      destination: destination.latLng,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (response,status)=>{
      this.directionsRenderer.setOptions({
        suppressPolylines: false,
        suppressMarkers: true,
        map:this.maps
      });

      if(status === google.maps.DirectionsStatus.OK){
        this.directionsRenderer.setDirections(response);
      }
    })
  }

}


