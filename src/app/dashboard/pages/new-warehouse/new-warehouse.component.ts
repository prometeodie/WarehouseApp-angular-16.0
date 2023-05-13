import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-new-warehouse',
  templateUrl: './new-warehouse.component.html',
  styleUrls: ['./new-warehouse.component.scss']
})
export class NewWarehouseComponent implements OnInit {
  private authService = inject(AuthService);

  constructor() {
      this.authService.checkAuthStatus().subscribe();
     }

  ngOnInit(): void {
  }

}
