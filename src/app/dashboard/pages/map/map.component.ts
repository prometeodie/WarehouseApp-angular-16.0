import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
 private  authService = inject(AuthService);

  constructor() {
      this.authService.checkAuthStatus().subscribe();
     }

  ngOnInit(): void {
  }

}
