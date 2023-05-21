import { Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import * as XLSX from 'xlsx';
import { LatLng, Place, Warehouse } from '../../interfaces';
import { google } from "google-maps";
import { MapsService } from '../../services/maps.service';
import Swal from 'sweetalert2';
import { tap, map } from 'rxjs';

@Component({
  selector: 'app-new-warehouse',
  templateUrl: './new-warehouse.component.html',
  styleUrls: ['./new-warehouse.component.scss']
})
export class NewWarehouseComponent implements OnDestroy{

  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private  fb = inject(FormBuilder);
  private list: string[] = [];
  public fancyFileText: string = 'No File Selected';
  private autoComplete:  google.maps.places.Autocomplete | undefined;
  private mapsService = inject(MapsService);
  private latlng:LatLng = {lat:0,lng:0}


  public myForm = this.fb.group({
    addres:['test 1234',[Validators.required, Validators.minLength(3)]],
    code:[0,[Validators.required, Validators.min(0)]],
    country:['Argentina',[]],
    list:[ [''] ,[]],
    name:['test',[Validators.required,Validators.minLength(2)]],
    zip:[0,[]]
  })

  @ViewChild("file", {read: ElementRef}) file!: ElementRef;
  @ViewChild('addres') addres!:ElementRef;


  constructor() { this.authService.checkAuthStatus().subscribe();}

  ngAfterViewInit(): void {
    this.autoComplete = new google.maps.places.Autocomplete(this.addres.nativeElement);
    this.mapsService.autoCompleteWarehouse(this.autoComplete);
    this.autoComplete.addListener('place_changed',()=>{this.autocompleteFormFields()})
  }

  ngOnDestroy(): void {
    // this.mapsService.setPlaces({});
  }

  get currentWarehouse():Warehouse{
    const warehouse:Warehouse = {...this.myForm.value, latLng: this.latlng} as Warehouse;
    return warehouse;
  }

  // gets the name of the excel file to show in the input file
  getFileName(){
    this.fancyFileText = this.file.nativeElement.files[0].name;
  }

  addNewWarehouse():void{
    if (this.myForm.invalid) return;

    Swal.fire({
      title: 'Do you want to save a new Warehouse?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const warehouse: Warehouse = this.currentWarehouse;
        warehouse.list = this.list;
        this.dashboardService.PostNewWarehouse(warehouse).subscribe();
      }
    })

  }

  readExcel (event:any):void{
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

  autocompleteFormFields(){
    this.mapsService.getPlaceWarehouse().pipe(
      map((place)=>{
        console.log('auitocompleteWarehouse',place);
        if(!place?.formatted_address) return;
        this.myForm.get('addres')?.setValue(place!.formatted_address);
        this.myForm.get('country')?.setValue(place!.country);
         this.fillLatLng(place);
      })
    ).subscribe()
  }

  fillLatLng(place:Place | null):void{
      if(!place!.location.lat() && !place!.location.lng()){this.latlng = {lat:0,lng:0}; return;}
      const lat = place!.location.lat();
      const lng = place!.location.lng();
      this.latlng = {lat,lng};
  }

  // TODO metodo para poner el valor de la long y lat en una propiedad

  // TODO:colocarlo en el validatorService
  isValidField(field: string):boolean | null{
    return this.myForm.get(field)!.errors &&
           this.myForm.get(field)!.touched
  }


}
