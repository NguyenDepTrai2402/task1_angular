import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonLabel
} from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCheckbox,
    DatePipe
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;

  @Output() edit = new EventEmitter<Todo>();

  private readonly todoService = inject(TodoService);

  onToggle(): void {
    this.todoService.toggleTodo(this.todo.id);
  }

  onDelete(): void {
    this.todoService.deleteTodo(this.todo.id);
  }

  onEdit(): void {
    this.edit.emit(this.todo);
  }
}