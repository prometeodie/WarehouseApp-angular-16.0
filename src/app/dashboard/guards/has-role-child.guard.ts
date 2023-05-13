import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';


export const hasRoleChildGuard = (allowedRoles:string[]) => {
  return()=>{

      const roles = inject(AuthService).currentUser()?.roles;
      const router = inject(Router);


      if ( allowedRoles.includes(roles!) ){
        console.log('entrop aca: TRUE',roles);
        return true
      }

      router.navigateByUrl('dashboard/warehouse-list');

      console.log('entrop aca: FALSe')
     return false;

  }
};

