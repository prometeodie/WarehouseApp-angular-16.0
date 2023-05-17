import { Component, OnInit, inject  } from '@angular/core';
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

  private authService = inject(AuthService);

  constructor( ){
  }
  ngOnInit(): void {

  }

}
