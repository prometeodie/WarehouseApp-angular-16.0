import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormsValidatorsService {
  public  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  constructor() { }

  isValidField(myForm: FormGroup,field: string):boolean | null{
    return myForm.get(field)!.errors &&
           myForm.get(field)!.touched
  }

}
