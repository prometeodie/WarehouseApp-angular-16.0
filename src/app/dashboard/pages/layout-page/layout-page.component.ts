import { Component, computed, inject  } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss']
})
export class LayoutPageComponent   {

private authService = inject(AuthService);

public user = computed(()=> this.authService.currentUser());

}
