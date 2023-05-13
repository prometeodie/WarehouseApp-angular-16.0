import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material/material.module';

import { HeaderComponent } from './components/header/header.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MapComponent } from './pages/map/map.component';
import { NewWarehouseComponent } from './pages/new-warehouse/new-warehouse.component';
import { WarehouseListComponent } from './pages/warehouse-list/warehouse-list.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutPageComponent,
    MapComponent,
    NewWarehouseComponent,
    WarehouseListComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
