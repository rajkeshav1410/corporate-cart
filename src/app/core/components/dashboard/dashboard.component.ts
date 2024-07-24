import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService, StorageService } from '../../services';
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
  currentUser!: AuthUser | null;

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.storageService.userData.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (user: AuthUser | null) => {
        this.currentUser = user
      },
    });

    if (this.storageService.isLoggedIn())
      this.currentUser = this.storageService.getUser();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onLogout = () => {
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.clean();
      },
      error: () => {
        this.storageService.clean();
      },
    });
  };
}
