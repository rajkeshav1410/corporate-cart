import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent, LoginComponent } from './core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'corporate-cart';
}
