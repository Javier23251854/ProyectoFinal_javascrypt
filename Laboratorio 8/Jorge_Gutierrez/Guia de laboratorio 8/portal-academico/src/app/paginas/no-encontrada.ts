import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="panel">
      <h1>Página no encontrada</h1>

      <p>
        La dirección solicitada no corresponde a una vista del portal.
      </p>

      <a class="btn btn-primary" routerLink="/resumen">
        Volver al resumen
      </a>
    </section>
  `,
})
export class NoEncontrada {}