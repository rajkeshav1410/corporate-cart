import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NameTransformerPipe } from '../../pipes';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatCardModule, NameTransformerPipe],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() photoUrl!: string;
  
  @Input() name!: string;
}
