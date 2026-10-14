import { Injectable, signal, effect } from '@angular/core';
import {Todo, TodoPriority} from '../models/todo.model';

const STORAGE_KEY = 'todos';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
    private readonly todoState = signal<Todo[]>(this.loadFromStorage());
    readonly todos = this.todoState.asReadonly();

    constructor() {
        effect(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todoState()));
            } catch {
            }
        });
    }

    private loadFromStorage(): Todo[] {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw) as Todo[];
            return parsed.map(todo => ({
                ...todo,
                dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
                createdAt: new Date(todo.createdAt),
                updatedAt: new Date(todo.updatedAt)
            }));
        } catch {
            return [];
        }
    }

    addTodo(
        title: string,
        description: string,
        priority: TodoPriority,
        dueDate?: Date
    ): void {
        const now = new Date();
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            title: title.trim(),
            description: description.trim() || undefined,
            completed: false,
            priority,
            dueDate,
            createdAt: now,
            updatedAt: now
        };
        this.todoState.update(todos => [...todos, newTodo]);
    }

    updateTodo(
        id: string,
        title: string,
        description: string,
        priority: TodoPriority,
        dueDate?: Date
    ): void {
    this.todoState.update(todos =>
      todos.map(todo =>
            todo.id === id
                    ? {
                          ...todo,
                          title: title.trim(),
                          description: description.trim() || undefined,
                          priority,
                          dueDate,
                          updatedAt: new Date()
                      }
                    : todo
            )
        );
    }
    deleteTodo(id: string): void {
        this.todoState.update(todos =>
            todos.filter(todo => todo.id !== id)
        );
    }
    toggleTodo(id: string): void {
        this.todoState.update(todos =>
            todos.map(todo =>
                todo.id === id
                    ? { ...todo,
                    completed: !todo.completed,
                    updatedAt: new Date()
                }
                : todo
            )
        );
    }
    setGoogleCalendarEventId(id: string, eventId: string): void {
    this.todoState.update(todos =>
        todos.map(todo =>
            todo.id === id
                ? {
                      ...todo,
                      googleCalendarEventId: eventId,
                      updatedAt: new Date()
                  }
                : todo
        )
    );
}
    clearGoogleCalendarEventId(id: string): void {
    this.todoState.update(todos =>
        todos.map(todo =>
            todo.id === id
                ? {
                      ...todo,
                      googleCalendarEventId: undefined,
                      updatedAt: new Date()
                  }
                : todo
        )
    );
}
    getTodoById(id: string): Todo | undefined {
        return this.todoState().find(todo => todo.id === id);
    }
}
