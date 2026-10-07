import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { TodoFormComponent } from './TodoPage/todo-form/todo-form.component';
import { TodoListComponent } from './TodoPage/todo-list/todo-list.component';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
  ]
})
export class AppComponent {
  constructor() {}
}
