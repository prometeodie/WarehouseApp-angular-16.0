import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseListComponent } from './pages/warehouse-list/warehouse-list.component';
import { NewWarehouseComponent } from './pages/new-warehouse/new-warehouse.component';
import { MapComponent } from './pages/map/map.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutPageComponent,
    children:[
      {path:'map', component: MapComponent },
      {path:'new-warehouse', component: NewWarehouseComponent },
      {path:'warehouse-list', component: WarehouseListComponent },
      {path: '**', redirectTo:'warehouse-list'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
