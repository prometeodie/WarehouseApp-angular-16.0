import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from 'src/assets/environments/environment';

import { HttpClient } from '@angular/common/http';
import { tap, catchError, of, map, Observable } from 'rxjs';
import { Warehouse } from '../interfaces/warehouse.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  private readonly baseUrl: string = environment.baseUrl;

  public getWarehouse(){

    return this.http.get<Warehouse[]>(`${this.baseUrl}/warehouses`);
  }

  public deleteWarehouse(id:string): Observable<{}>{
    return this.http.delete(`${this.baseUrl}/warehouses/${id}`)
    .pipe(
      map(()=>{return of(true)}),
      catchError(error=>{return of(false)})
    )
  }

  public getWarehouseById(id:string):Observable<Warehouse | undefined>{
    return this.http.get<Warehouse>(`${this.baseUrl}/warehouses/${id}`)
    .pipe(
      // map((resp)=>{return resp}),
      catchError(error => of(undefined))
    )
  }

}


