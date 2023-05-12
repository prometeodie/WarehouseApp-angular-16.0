import { Component, computed, inject  } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

export  interface SideNavItems{
  label:string;
  icon:string;
  url:string;
}
@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss']
})
export class LayoutPageComponent   {

private authService = inject(AuthService);

public user = computed(()=> this.authService.currentUser());

public sideNavItems: SideNavItems[] = [
  {label:'warehouse List', icon:'home',url:'/dashboard/warehouse-list'},
  {label:'Add new Warehouse', icon:'add_box' ,url:'/dashboard/new-warehouse' },
  {label:'Closest Warehouse', icon:'map' ,url:'/dashboard/map' }
]



}
