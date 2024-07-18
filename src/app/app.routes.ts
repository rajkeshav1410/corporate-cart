import { Routes } from '@angular/router';
import { DashboardComponent } from './core';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    loadChildren: () =>
      import('./core/components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
];
