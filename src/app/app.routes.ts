import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'todo/new',
    loadComponent: () =>
      import('./TodoPage/todo-form/todo-form.component')
        .then((m) => m.TodoFormComponent),
  },
  {
  path: 'edit/:id',
  loadComponent: () =>
    import('./TodoPage/todo-form/todo-form.component')
      .then((m) => m.TodoFormComponent),
},
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];