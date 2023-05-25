import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseListComponent } from './pages/warehouse-list/warehouse-list.component';
import { NewWarehouseComponent } from './pages/new-warehouse/new-warehouse.component';
import { MapComponent } from './pages/map/map.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { hasRoleGuard } from './guards/has-role.guard';


const routes: Routes = [
  {
    path:'',
    component: LayoutPageComponent,
    children:[
      {path:'map',canActivate:[hasRoleGuard],data:{allowedRoles:['ADMIN']},component: MapComponent },
      {path:'new-warehouse',canActivate:[hasRoleGuard],data:{allowedRoles:['ADMIN','USER']}, component: NewWarehouseComponent },
      {path:'warehouse-list',canActivate:[hasRoleGuard],data:{allowedRoles:['ADMIN','USER']},component: WarehouseListComponent},
      {path: '**', redirectTo:'warehouse-list',}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
