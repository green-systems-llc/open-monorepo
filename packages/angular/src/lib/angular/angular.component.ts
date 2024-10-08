import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'green-systems-angular',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './angular.component.html',
  styleUrl: './angular.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngularComponent {}
