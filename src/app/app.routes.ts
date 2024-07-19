import { Routes } from '@angular/router';

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
          import('./inventory').then((m) => m.InventoryComponent),
      },
      {
        path: 'transaction',
        loadComponent: () =>
          import('./transaction').then((m) => m.TransactionComponent),
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
