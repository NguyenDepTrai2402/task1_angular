import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  IonButton,
  IonDatetime,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonContent,
  IonTextarea
} from '@ionic/angular';

import { Todo, TodoPriority } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';
import { GoogleCalendarService } from '../../services/google-calendar';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  imports: [IonContent, 
    ReactiveFormsModule,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonItem,
    IonLabel,
    IonButton
  ]
})
export class TodoFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly todoService = inject(TodoService);
  private readonly googleCalendarService = inject(GoogleCalendarService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  todo?: Todo;

  readonly todoForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
    priority: ['medium' as TodoPriority],
    dueDate: ['']
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.todo = this.todoService.getTodoById(id);

      if (this.todo) {
        this.todoForm.patchValue({
          title: this.todo.title,
          description: this.todo.description ?? '',
          priority: this.todo.priority,
          dueDate: this.todo.dueDate
            ? this.todo.dueDate.toISOString()
            : ''
        });
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const formValue = this.todoForm.getRawValue();
    const dueDate = formValue.dueDate
      ? new Date(formValue.dueDate)
      : undefined;

    if (this.todo) {
      this.todoService.updateTodo(
        this.todo.id,
        formValue.title,
        formValue.description,
        formValue.priority,
        dueDate
      );

      await this.syncCalendarOnEdit(
        this.todo,
        formValue.title,
        formValue.description,
        dueDate
      );
    } else {
      this.todoService.addTodo(
        formValue.title,
        formValue.description,
        formValue.priority,
        dueDate
      );
    }

    this.router.navigate(['/home']);
  }

  private async syncCalendarOnEdit(
    todo: Todo,
    title: string,
    description: string,
    dueDate: Date | undefined
  ): Promise<void> {
    const eventId = todo.googleCalendarEventId;

    if (!eventId) {
      return;
    }

    try {
      if (dueDate) {
        await this.googleCalendarService.updateCalendarEvent(
          eventId,
          title,
          description,
          dueDate
        );
        alert('Đã cập nhật Todo và sự kiện trên Google Calendar');
      } else {
        await this.googleCalendarService.deleteCalendarEvent(eventId);
        this.todoService.clearGoogleCalendarEventId(todo.id);
        alert('Đã cập nhật Todo và xóa sự kiện trên Google Calendar');
      }
    } catch (error) {
      console.error('Google Calendar error:', error);
      alert('Đã lưu Todo, nhưng không đồng bộ được với Google Calendar');
    }
  }
  goBack(): void {
  this.router.navigate(['/home']);
}
}
