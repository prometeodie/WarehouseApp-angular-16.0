import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MapComponent } from './pages/map/map.component';
import { WarehouseListComponent } from './pages/warehouse-list/warehouse-list.component';
import { NewWarehouseComponent } from './pages/new-warehouse/new-warehouse.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';


@NgModule({
  declarations: [
    MapComponent,
    WarehouseListComponent,
    NewWarehouseComponent,
    HeaderComponent,
    LayoutPageComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
