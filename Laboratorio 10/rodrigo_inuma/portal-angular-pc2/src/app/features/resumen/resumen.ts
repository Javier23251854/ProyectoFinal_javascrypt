
import { Component, computed, inject, signal } from '@angular/core';
import { EstudiantesApi } from '../../core/services/estudiantes-api';
import { estadoAcademico } from '../../modelos/estudiante';

@Component({
  selector: 'app-resumen',
  standalone: true,
  template: `
    <main class="container py-4">
      <h1>Resumen académico</h1>
      <p>Consulta el estado general de los estudiantes.</p>

      @if (cargando()) {
        <p>Cargando información...</p>
      } @else if (error()) {
        <p role="alert">No se pudo cargar la información. Verifica que la API esté activa.</p>
      } @else {
        <section class="row g-3 mt-2">
          <div class="col-md-4">
            <article class="card card-body">
              <h2 class="h5">Total de estudiantes</h2>
              <p class="fs-3">{{ estudiantes().length }}</p>
            </article>
          </div>

          <div class="col-md-4">
            <article class="card card-body">
              <h2 class="h5">Destacados</h2>
              <p class="fs-3">{{ destacados() }}</p>
            </article>
          </div>

          <div class="col-md-4">
            <article class="card card-body">
              <h2 class="h5">En riesgo</h2>
              <p class="fs-3">{{ enRiesgo() }}</p>
            </article>
          </div>
        </section>
      }
    </main>
  `,
})
export class Resumen {
  private readonly api = inject(EstudiantesApi);

  readonly estudiantes = signal<{
    id: string;
    nombre: string;
    programa: 'Software' | 'Sistemas';
    promedio: number;
    asistencia: number;
  }[]>([]);

  readonly cargando = signal(true);
  readonly error = signal(false);

  readonly destacados = computed(
    () => this.estudiantes().filter(
      (e) => estadoAcademico(e.promedio) === 'Destacado',
    ).length,
  );

  readonly enRiesgo = computed(
    () => this.estudiantes().filter(
      (e) => estadoAcademico(e.promedio) === 'En riesgo',
    ).length,
  );

  constructor() {
    this.api.listar().subscribe({
      next: (datos) => {
        this.estudiantes.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }
}
