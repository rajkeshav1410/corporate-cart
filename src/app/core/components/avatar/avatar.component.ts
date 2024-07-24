import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NameTransformerPipe } from '../../pipes';
import { NgOptimizedImage } from '@angular/common';
import { AuthUser } from '@app/core/models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    MatCardModule,
    NameTransformerPipe,
    NgOptimizedImage,
    MatIconModule,
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input({ required: true }) user!: AuthUser;
}
