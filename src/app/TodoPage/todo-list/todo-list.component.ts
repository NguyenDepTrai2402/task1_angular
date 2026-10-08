import { Component, Input, inject } from '@angular/core';
import { IonList } from '@ionic/angular';
import { Router } from '@angular/router';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
  imports: [
    IonList,
    TodoItemComponent
  ],
})
export class TodoListComponent  {
 private readonly router = inject(Router);
@Input() todos: Todo[] = [];
  onEdit(todo: Todo): void {
    this.router.navigate(['/edit', todo.id]);
  }
}