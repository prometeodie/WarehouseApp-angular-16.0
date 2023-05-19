import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public emailPatternMenssage: string = 'example.1@exmaple.com, especial characters accepted:._ % -';
  public passwordPatternMenssage: string = 'shoud be 8-16 characters.';

  // TODO:Borrar las credenciales en duro
  public myForm = this.fb.group({
    email:['admin@admin.com',[Validators.required, Validators.pattern(this.emailPattern)]],
    password:['123456',[Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
  })

  constructor() { }

  ngOnInit(): void {
  }

  isValidField(field: string):boolean | null{
    return this.myForm.get(field)!.errors &&
           this.myForm.get(field)!.touched
  }

  showError(field: string, pattern:string):string | null{
    if (!this.myForm.contains(field)) return null;

    const errors = this.myForm.get(field)!.errors || {};

    for (const key of Object.keys(errors)) {

      switch (key){
        case 'required':
          return 'this field is required';

        case 'pattern':
          return `Invalid format, ${field}: ${pattern}`;

        case 'minlength':
          return `Invalid format, ${field}: ${pattern}`;
      }
    }

    return null;

  }

  login(){
    const {email , password} = this.myForm.value;
    this.authService.login(email!, password!)
    .subscribe({
      next: () => this.router.navigateByUrl('/dashboard/home'),
      error: (message)=>{
        Swal.fire('Error','Your Email or password is incorrect!','error')
      }
    });
  }

}
