import { Routes } from '@angular/router';
import { authGuard } from './core';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'store',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/components/login').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./core/components/signup').then((m) => m.SignupComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/components/dashboard').then((m) => m.DashboardComponent),
    children: [
      {
        path: 'store',
        loadComponent: () => import('./store').then((m) => m.StoreComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('@app/inventory').then((m) => m.InventoryComponent),
        canActivate: [authGuard],
      },
      {
        path: 'transaction',
        loadComponent: () =>
          import('./transaction').then((m) => m.TransactionComponent),
        canActivate: [authGuard],
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./core/components/about').then((m) => m.AboutComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./core/components/page-not-found').then(
            (m) => m.PageNotFoundComponent,
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/components/login').then((m) => m.LoginComponent),
  },
];
