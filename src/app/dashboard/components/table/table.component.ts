
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../services/dashboard.service';
import { Warehouse } from '../../interfaces';
import Swal from 'sweetalert2';



@Component({
  selector: 'component-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

  private dashboardService = inject(DashboardService)


  ngOnInit(): void {
    this.getWarehouses();
  }
  displayedColumns: string[] = ['code','name','addres','country','zip','actions'];
  dataSource = new MatTableDataSource<Warehouse>([]);

  @ViewChild(MatPaginator)
    paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getWarehouses(){
    this.dashboardService.getWarehouse().subscribe(warehouses => {this.dataSource.data = warehouses;});
  }

  downloadList(id:string){

    this.dashboardService.downloadExcel(id);

  }

  deleteWarehouse(id:string,name:string){

      Swal.fire({
        title: `Delete warehouse ${name}?`,
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {

        this.dashboardService.deleteWarehouse(id)
        .subscribe(resp =>{

          if(!resp){
              Swal.fire(
                'Error',
                'Something goes wrong!!!',
                'error'
              )
              return;
            }
              Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
            )
          this.getWarehouses();
        },
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          'Your file is safe :)',
          'error'
        )
      }
    })
  }
}

