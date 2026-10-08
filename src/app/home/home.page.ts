import { Component, inject, signal } from '@angular/core';
import {  RouterLink } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonTitle,
  IonSearchbar,
  IonToolbar,
} from '@ionic/angular';

import { TodoListComponent } from '../TodoPage/todo-list/todo-list.component';
import { TodoService } from '../services/todo.service';
import {
  add,
  homeOutline,
  checkmarkOutline,
  settingsOutline
} from 'ionicons/icons';import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    RouterLink,
    IonButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonSearchbar,
    IonIcon,
    TodoListComponent
]
})
export class HomePage {

  selectedFilter = signal<'all' | 'active' | 'completed'>('all');

  searchInput = '';

  searchKeyword = signal('');

  private readonly todoService = inject(TodoService);

  readonly todos = this.todoService.todos;

  constructor() {
    addIcons({
    add,
    homeOutline,
    checkmarkOutline,
    settingsOutline
});
  }

  selectFilter(filter: 'all' | 'active' | 'completed'): void {
    this.selectedFilter.set(filter);
  }

  onSearchInput(event: Event): void {
    const searchbar = event.target as HTMLIonSearchbarElement;
    this.searchInput = searchbar.value ?? '';
  }

  onSearch(): void {
    this.searchKeyword.set(
      this.searchInput.trim().toLowerCase()
    );
  }
  readonly filteredTodos = () => {
    const filter = this.selectedFilter();
    const keyword = this.searchKeyword();

    return this.todos().filter(todo => {

      const matchesSearch =
        todo.title.toLowerCase().includes(keyword) ||
        (todo.description ?? '').toLowerCase().includes(keyword);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);

      return matchesSearch && matchesFilter;
    });
  };
}