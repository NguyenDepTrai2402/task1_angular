import { Component, Input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonLabel,
  IonProgressBar
} from '@ionic/angular';
@Component({
  selector: 'app-todo-summary',
  templateUrl: './todo-summary.component.html',
  styleUrls: ['./todo-summary.component.scss'],
  imports: [
    IonCard,
    IonCardContent,
    IonLabel,
    IonProgressBar
  ],
})
export class TodoSummaryComponent {
  @Input() totalTodos = 0;
  @Input() completedTodos = 0;
}
