import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MapComponent } from './pages/map/map.component';
import { NewWarehouseComponent } from './pages/new-warehouse/new-warehouse.component';
import { WarehouseListComponent } from './pages/warehouse-list/warehouse-list.component';
import { TableComponent } from './components/table/table.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
    declarations: [
        HeaderComponent,
        LayoutPageComponent,
        MapComponent,
        NewWarehouseComponent,
        TableComponent,
        WarehouseListComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        SharedModule,
    ]
})
export class DashboardModule { }
