
import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'resumen',
    pathMatch: 'full',
  },
  {
    path: 'resumen',
    title: 'Resumen académico',
    loadComponent: () =>
      import('./features/resumen/resumen').then((m) => m.Resumen),
  },
  {
    path: 'estudiantes',
    title: 'Estudiantes',
    loadComponent: () =>
      import('./features/estudiantes/estudiantes').then((m) => m.Estudiantes),
  },
  {
    path: 'registro',
    title: 'Registrar estudiante',
    loadComponent: () =>
      import('./features/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'registro/:id',
    title: 'Editar estudiante',
    loadComponent: () =>
      import('./features/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'informe',
    title: 'Informe académico',
    loadComponent: () =>
      import('./features/informe/informe').then((m) => m.Informe),
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () =>
      import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
