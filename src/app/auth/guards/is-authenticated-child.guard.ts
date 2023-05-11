import { CanActivateFn } from '@angular/router';
import { isAuthenticatedGuard } from './is-authenticated.guard';


export const isAuthenticatedChildGuard: CanActivateFn = (route, state) => {

  return isAuthenticatedGuard(route, state);

};
