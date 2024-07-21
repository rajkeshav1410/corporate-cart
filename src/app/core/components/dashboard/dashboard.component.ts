import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService, StorageService } from '../../services';
import { Routes } from '../../constants';
import { AuthUser } from '../../models';
import { AvatarComponent } from '../avatar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    CommonModule,
    RouterOutlet,
    RouterModule,
    AvatarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  currentUser!: AuthUser | null;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn())
      this.currentUser = this.storageService.getUser();
  }

  onLogout = () => {
    this.authService.logout().subscribe({
      next: (response: Response) => {
        this.storageService.clean();
      },
      error: () => {
        this.storageService.clean();
      },
    });
  };
}
