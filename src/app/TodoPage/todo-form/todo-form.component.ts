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
  IonTextarea
} from '@ionic/angular';

import { Todo, TodoPriority } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  imports: [
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

  onSubmit(): void {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const formValue = this.todoForm.getRawValue();

    if (this.todo) {
      this.todoService.updateTodo(
        this.todo.id,
        formValue.title,
        formValue.description,
        formValue.priority,
        formValue.dueDate
          ? new Date(formValue.dueDate)
          : undefined
      );
    } else {
      this.todoService.addTodo(
        formValue.title,
        formValue.description,
        formValue.priority,
        formValue.dueDate
          ? new Date(formValue.dueDate)
          : undefined
      );
    }

    this.router.navigate(['/home']);
  }
  goBack(): void {
  this.router.navigate(['/home']);
}
}