import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services';
import { AuthUser } from '../../models';
import { AvatarComponent } from '../avatar';
import { Subject, takeUntil } from 'rxjs';

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
export class DashboardComponent implements OnInit, OnDestroy {
  // Current user data
  currentUser!: AuthUser | null;

  // Subject to manage component destruction
  onDestroy$: Subject<void> = new Subject();

  constructor(private authService: AuthService) {}

  /**
   * Initialization lifecycle hook
   */
  ngOnInit(): void {
    this.authService.userData.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (user: AuthUser | null) => {
        this.currentUser = user;
      },
    });
  }

  /**
   * Clean up before component destruction
   */
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Logout user and clean up storage
   */
  onLogout = () => {
    this.authService.logout().subscribe();
  };
}
