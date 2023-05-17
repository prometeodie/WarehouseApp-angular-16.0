import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import * as XLSX from 'xlsx';
import { Warehouse } from '../../interfaces';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';

@Component({
  selector: 'app-new-warehouse',
  templateUrl: './new-warehouse.component.html',
  styleUrls: ['./new-warehouse.component.scss']
})
export class NewWarehouseComponent   {

  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private  fb = inject(FormBuilder);
  private list: string[] = [];


  public myForm = this.fb.group({
    addres:['test 1234',[Validators.required, Validators.minLength(3)]],
    code:[0,[Validators.required, Validators.min(0)]],
    country:['Argentina',[Validators.required, Validators.minLength(3)]],
    list:[ [''] ,[]],
    name:['test',[Validators.required,Validators.minLength(2)]],
    zip:[0,[]]
  })

  @ViewChild("file", {
    read: ElementRef
  }) file!: ElementRef;

  public fancyFileText: string = 'No File Selected';

  constructor() {
      this.authService.checkAuthStatus().subscribe();
     }

  get currentWarehouse():Warehouse{
    const warehouse = this.myForm.value as Warehouse;
    return warehouse;
  }

  getFileName(){
    this.fancyFileText = this.file.nativeElement.files[0].name;
  }

  addNewWarehouse(){
    if (this.myForm.invalid) return;

    const warehouse: Warehouse = this.currentWarehouse;
    warehouse.list = this.list;
    this.dashboardService.PostNewWarehouse(warehouse).subscribe();
  }

  readExcel (event:any){
    this.getFileName();
    const file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e)=>{
      let workBook = XLSX.read(fileReader.result,{type:'binary'});
      let sheetNames = workBook.SheetNames;
      this.list = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
    }
  }

  isValidField(field: string):boolean | null{
    return this.myForm.get(field)!.errors &&
           this.myForm.get(field)!.touched
  }


}
