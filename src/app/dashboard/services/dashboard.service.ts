import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from 'src/assets/environments/environment';

import { HttpClient } from '@angular/common/http';
import { tap, catchError, of, map, Observable, Subject } from 'rxjs';
import { Warehouse } from '../interfaces/warehouse.interface';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Place } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  private readonly baseUrl: string = environment.baseUrl;

  public test: string[] =[];
  private router = inject(Router)

  private warehouseLocation$ = new Subject<Place>();
  // CRUD
  public getWarehouse(){

    return this.http.get<Warehouse[]>(`${this.baseUrl}/warehouses`);

  }

  public getWarehouseById(id:string):Observable<Warehouse | undefined>{
    return this.http.get<Warehouse>(`${this.baseUrl}/warehouses/${id}`)
    .pipe(
      catchError(error => of(undefined))
    )
  }

  public deleteWarehouse(id:string): Observable<{}>{
    return this.http.delete(`${this.baseUrl}/warehouses/${id}`)
    .pipe(
      map(()=>{return of(true)}),
      catchError(error=>{return of(false)})
    )
  }

  public PostNewWarehouse(warehouse: Warehouse):Observable<{}>{

    return this.http.post<Warehouse>(`${this.baseUrl}/warehouses/`,warehouse).pipe(
        tap((resp)=>{
          if(resp){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'New warehouse has been saved',
              showConfirmButton: false,
              timer: 2000
            })
            this.router.navigateByUrl('dashboard/warehouse-list');
          }
        }),
        catchError(error=>{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'New warehouse has not been saved',
            showConfirmButton: false,
            timer: 2000
          })
          return of(false)
        })
    )

  }

  // to add a new warehouse place
  setPlaceWarehouse(place: Place) {
    this.warehouseLocation$.next(place);
  }

  getPlaceWarehouse() {
    return this.warehouseLocation$.asObservable();
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
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: text,
          showConfirmButton: false,
          timer: 2000
        })
        
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


  public downloadExcel(id:string):void{

    this.getWarehouseById(id).subscribe(warehouse=>{
      if(!warehouse) {
        Swal.fire(
          'Error',
          'Something goes wrong!!!',
          'error'
        )
        return;
      };

        this.exportToExcel(warehouse);
    })
  }

  //makes the warehouse list in an excel file and download the file.
  exportToExcel(warehouse:Warehouse):void{
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const worksheet = XLSX.utils.json_to_sheet(warehouse.list);

    const workbook : XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet1');

    XLSX.writeFile(workbook, `warehouse:${warehouse.name}.xlsx`)
  }

   readExcel (event:any){

    const file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e)=>{
      let workBook = XLSX.read(fileReader.result,{type:'binary'});
      let sheetNames = workBook.SheetNames;
      this.test = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
      console.log(this.test);
    }
  }

}


