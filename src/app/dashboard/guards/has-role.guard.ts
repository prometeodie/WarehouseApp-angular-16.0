import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map} from "rxjs";
import { AuthService } from "src/app/auth/services/auth.service";


export const hasRoleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoutes: string[]= route.data?.['allowedRoles'];

  return authService.getUsersRol().pipe(
    map(rol=> {
      if(allowedRoutes.includes(rol)){
      return true;
    }
    router.navigateByUrl('dashboard/warehouse-list');
    return false
  })
  )
};
