import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox
} from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { GoogleCalendarService } from '../../services/google-calendar';

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
  private readonly googleCalendarService = inject(GoogleCalendarService);

  onToggle(): void {
    this.todoService.toggleTodo(this.todo.id);
  }

  async onDelete(): Promise<void> {
    try {
      if (this.todo.googleCalendarEventId) {
        await this.googleCalendarService.deleteCalendarEvent(
          this.todo.googleCalendarEventId
        );
      }

      this.todoService.deleteTodo(this.todo.id);

      alert('Đã xóa Todo và sự kiện trên Google Calendar');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Không thể xóa sự kiện trên Google Calendar');
    }
  }

  onEdit(): void {
    this.edit.emit(this.todo);
  }

  async onAddToCalendar(): Promise<void> {
    if (!this.todo.dueDate) {
      alert('Todo này chưa có hạn hoàn thành');
      return;
    }

    if (this.todo.googleCalendarEventId) {
      alert('Todo này đã được thêm vào Google Calendar');
      return;
    }

    try {
      const eventId =
        await this.googleCalendarService.addTodoToCalendar(
          this.todo.title,
          this.todo.description,
          this.todo.dueDate
        );

      this.todoService.setGoogleCalendarEventId(
        this.todo.id,
        eventId
      );

      alert('Đã thêm Todo vào Google Calendar');
    } catch (error) {
      console.error('Google Calendar error:', error);
      alert('Không thể thêm Todo vào Google Calendar');
    }
  }
}