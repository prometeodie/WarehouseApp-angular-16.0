import { Component, OnInit  } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

export  interface SideNavItems{
  label:string;
  roles:string[]
  icon:string;
  url:string;
}
@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss']
})
export class LayoutPageComponent implements OnInit   {

public sideNavItems: SideNavItems[] = [
  {label:'warehouse List',   roles:['ADMIN','USER'], icon:'home',url:'/dashboard/warehouse-list'},
  {label:'Closest Warehouse',roles:['ADMIN'], icon:'map' ,url:'/dashboard/map' }]

  constructor( ){

  }
  ngOnInit(): void {

  }

}
