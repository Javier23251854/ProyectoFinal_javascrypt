import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <main class="container py-4">
      <h1>Página no encontrada</h1>
      <p>La dirección que ingresaste no existe.</p>
      <a routerLink="/resumen">Volver al resumen</a>
    </main>
  `,
  imports: [],
})
export class NotFound {}