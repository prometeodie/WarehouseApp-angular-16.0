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

  public emailRegex :string='^\w+@[a-z]{5,7}\.[a-z]{2,3}\.?[a-z]{2,3}?$'
  public passwordRegexp :string='/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/;'
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // TODO:Borrar las credenciales en duro
  public myForm = this.fb.group({
    email:['olivier@mail.com',[Validators.required]],
    password:['123456',[Validators.required]]
  })


  constructor() { }

  ngOnInit(): void {
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
