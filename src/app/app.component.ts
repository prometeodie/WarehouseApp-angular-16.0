import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  private authService = inject(AuthService);
  public router = inject(Router);

  constructor(){
    this.authService.checkAuthStatus().subscribe();
  }

  public finishAuthCheck = computed<boolean>(()=>{
    if(this.authService.authStatus() === AuthStatus.checking ){
      return false;
    }
    return true;

  });

  public authStatusChangeEfect = effect(()=>{

    switch (this.authService.authStatus()){

      case AuthStatus.checking:
        return;

      case AuthStatus.authenticated:
        return;

      case AuthStatus.noAuthenticated:
        this.router.navigateByUrl('/auth/login')
        return;
    }
  })

}
