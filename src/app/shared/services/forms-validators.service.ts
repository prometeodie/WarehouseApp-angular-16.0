import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup } from '@angular/forms';
import { map, tap } from 'rxjs';
import { Warehouse } from 'src/app/dashboard/interfaces';
import { environment } from 'src/assets/environments/environment';
import { google } from "google-maps";

@Injectable({
  providedIn: 'root'
})
export class FormsValidatorsService {
  public  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  private http = inject(HttpClient);

  constructor() { }

  isValidField(myForm: FormGroup,field: string):boolean | null{
    return myForm.get(field)!.errors &&
           myForm.get(field)!.touched
  }

  showError(form: FormGroup, field: string):string | null{
    if (!form.contains(field)) return null;

    const errors = form.get(field)!.errors || {};

    const errorMenssages:any = {
      required: 'This field is required',
      validAddres:'Select a valid addres',
      minlength:`Minimun lenght accepted ${errors['minlength']?.requiredLength}.`,
      min:`Minimun value accepted ${errors['min']?.min}`,
      duplicateCode:`The code ${form.get(field)?.value} is already taken.`,
    }

    for (const key of Object.keys(errors)) {
        return errorMenssages[key];
    }

    return null;
  }

  // Async functions

 duplicateCode(): AsyncValidatorFn{

    const baseUrl: string = environment.baseUrl;
    return (control: AbstractControl)=>{
     return this.http.get<Warehouse[]>(`${baseUrl}/warehouses`).pipe(
      map(warehouses => {
        const isValid = warehouses.map(warehouse=>{ return warehouse.code}).includes(control.value);
        return (!isValid)? null : {duplicateCode:true};
      })
     )
  }}


    validateAddres(){

       const geocoder = new google.maps.Geocoder();
       const addres = { address:'pozos 1andil'}
       let test: any;

       const callback = (results:any, status:any) => {
          if (status == 'OK') {
            test=results;
            console.log('se encontro direccion',results)
            return  {duplicateCode:true}
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
            return true;
          }
        }
        console.log(geocoder.geocode(addres, callback ));
       return  geocoder.geocode(addres, callback );

    }


      // if(!localStorage.getItem('addres')) {return {validAddres:true}};

      // const value = control.value.trim()
      // const addres: string = localStorage.getItem('addres')!;

      // return (addres === value)? null : {validAddres:true} ;
      // return {validAddres:true}

  }

