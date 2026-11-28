import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstudiantesApi } from '../../core/services/estudiantes-api';
import type { Estudiante } from '../../modelos/estudiante';
import {
FILTRO_INICIAL,
filtrarYOrdenar,
type FiltroEstudiantes,
type OpcionPrograma,
type OpcionEstado,
type OrdenEstudiantes,
} from '../../core/utils/filtro-estudiantes';

@Component({
selector: 'app-estudiantes',
standalone: true,
imports: [RouterLink],
template: `
<main class="container py-4">
<h1>Estudiantes</h1>
<p>Consulta y administra los estudiantes registrados.</p>

  <div class="row g-3 mb-4">
    <div class="col-md-6">
      <label for="busqueda" class="form-label">Buscar por nombre</label>
      <input
        id="busqueda"
        type="search"
        class="form-control"
        placeholder="Escribe un nombre..."
        [value]="filtro().termino"
        (input)="actualizarFiltro('termino', $any($event.target).value)"
      />
    </div>

    <div class="col-md-6">
      <label for="programa" class="form-label">Programa</label>
      <select
        id="programa"
        class="form-select"
        [value]="filtro().programa"
        (change)="actualizarFiltro('programa', $any($event.target).value)"
      >
        <option value="Todos">Todos</option>
        <option value="Software">Software</option>
        <option value="Sistemas">Sistemas</option>
      </select>
    </div>

    <div class="col-md-6">
      <label for="estado" class="form-label">Estado académico</label>
      <select
        id="estado"
        class="form-select"
        [value]="filtro().estado"
        (change)="actualizarFiltro('estado', $any($event.target).value)"
      >
        <option value="Todos">Todos</option>
        <option value="Destacado">Destacado</option>
        <option value="Aprobado">Aprobado</option>
        <option value="En riesgo">En riesgo</option>
      </select>
    </div>

    <div class="col-md-6">
      <label for="orden" class="form-label">Ordenar por</label>
      <select
        id="orden"
        class="form-select"
        [value]="filtro().orden"
        (change)="actualizarFiltro('orden', $any($event.target).value)"
      >
        <option value="nombre">Nombre (A-Z)</option>
        <option value="promedio-desc">Promedio (mayor a menor)</option>
        <option value="asistencia-desc">Asistencia (mayor a menor)</option>
      </select>
    </div>
  </div>

  <button
    type="button"
    class="btn btn-outline-secondary mb-3"
    (click)="limpiarFiltros()"
  >
    Limpiar filtros
  </button>

  @if (mensaje()) {
    <p class="alert alert-info" role="status">{{ mensaje() }}</p>
  }

  @if (cargando()) {
    <p>Cargando estudiantes...</p>
  } @else if (error()) {
    <p role="alert" class="text-danger">
      No se pudieron cargar los estudiantes.
    </p>
    <button class="btn btn-primary" (click)="cargar()">Reintentar</button>
  } @else {
    <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
      <p class="mb-0">Estudiantes encontrados: {{ filtrados().length }}</p>
      <p class="mb-0">Estudiantes seleccionados: {{ seleccionados().length }}</p>

      <button
        type="button"
        class="btn btn-outline-primary btn-sm"
        (click)="seleccionarVisibles()"
      >
        {{ todosVisiblesSeleccionados() ? 'Deseleccionar visibles' : 'Seleccionar visibles' }}
      </button>

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        (click)="limpiarSeleccion()"
        [disabled]="seleccionados().length === 0"
      >
        Limpiar selección
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-bordered align-middle">
        <thead>
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                aria-label="Seleccionar todos los estudiantes visibles"
                [checked]="todosVisiblesSeleccionados()"
                [indeterminate]="algunosVisiblesSeleccionados()"
                (change)="seleccionarVisibles()"
              />
            </th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Programa</th>
            <th>Promedio</th>
            <th>Asistencia (%)</th>
            <th>Estado académico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (estudiante of filtrados(); track estudiante.id) {
            <tr>
              <td>
                <input
                  type="checkbox"
                  [attr.aria-label]="'Seleccionar a ' + estudiante.nombre"
                  [checked]="estaSeleccionado(estudiante.id)"
                  (change)="cambiarSeleccion(estudiante.id)"
                />
              </td>
              <td>{{ estudiante.id }}</td>
              <td>{{ estudiante.nombre }}</td>
              <td>{{ estudiante.programa }}</td>
              <td>{{ estudiante.promedio }}</td>
              <td>{{ estudiante.asistencia }}%</td>
              <td>{{ obtenerEstado(estudiante.promedio) }}</td>
              <td>
                <div class="d-flex gap-2">
                  <a
                    class="btn btn-sm btn-primary"
                    [routerLink]="['/registro', estudiante.id]"
                  >
                    Editar
                  </a>
                  <button
                    type="button"
                    class="btn btn-sm btn-danger"
                    [disabled]="eliminando().includes(estudiante.id)"
                    (click)="eliminar(estudiante)"
                  >
                    {{ eliminando().includes(estudiante.id) ? 'Eliminando...' : 'Eliminar' }}
                  </button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="8" class="text-center">
                No se encontraron estudiantes.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  }
</main>

`,
})
export class Estudiantes {
private readonly api = inject(EstudiantesApi);

readonly estudiantes = signal<Estudiante[]>([]);
readonly filtro = signal<FiltroEstudiantes>(FILTRO_INICIAL);
readonly seleccionados = signal<string[]>([]);
readonly eliminando = signal<string[]>([]);
readonly cargando = signal(true);
readonly error = signal(false);
readonly mensaje = signal('');

readonly filtrados = computed(() =>
filtrarYOrdenar(this.estudiantes(), this.filtro()),
);

readonly todosVisiblesSeleccionados = computed(() => {
const visibles = this.filtrados();
return visibles.length > 0 &&
visibles.every((e) => this.seleccionados().includes(e.id));
});

readonly algunosVisiblesSeleccionados = computed(() => {
const visibles = this.filtrados();
const seleccionados = this.seleccionados();

return visibles.some((e) => seleccionados.includes(e.id)) &&
  !visibles.every((e) => seleccionados.includes(e.id));

});

constructor() {
this.cargar();
}

actualizarFiltro(campo: 'termino', valor: string): void;
actualizarFiltro(campo: 'programa', valor: OpcionPrograma): void;
actualizarFiltro(campo: 'estado', valor: OpcionEstado): void;
actualizarFiltro(campo: 'orden', valor: OrdenEstudiantes): void;
actualizarFiltro(
campo: keyof FiltroEstudiantes,
valor: string,
): void {
this.filtro.update((actual) => ({ ...actual, [campo]: valor }));
}

limpiarFiltros(): void {
this.filtro.set(FILTRO_INICIAL);
}

estaSeleccionado(id: string): boolean {
return this.seleccionados().includes(id);
}

cambiarSeleccion(id: string): void {
this.seleccionados.update((actuales) =>
actuales.includes(id)
? actuales.filter((seleccionado) => seleccionado !== id)
: [...actuales, id],
);
}

seleccionarVisibles(): void {
const idsVisibles = this.filtrados().map((e) => e.id);

if (this.todosVisiblesSeleccionados()) {
  this.seleccionados.update((actuales) =>
    actuales.filter((id) => !idsVisibles.includes(id)),
  );
  return;
}

this.seleccionados.update((actuales) =>
  [...new Set([...actuales, ...idsVisibles])],
);

}

limpiarSeleccion(): void {
this.seleccionados.set([]);
}

obtenerEstado(promedio: number): string {
if (promedio >= 14) return 'Destacado';
return promedio >= 11 ? 'Aprobado' : 'En riesgo';
}

eliminar(estudiante: Estudiante): void {
const confirmar = window.confirm(
  `¿Estás seguro de que deseas eliminar a ${estudiante.nombre}? Esta acción no se puede deshacer.`,
);

if (!confirmar) return;

this.mensaje.set('');
this.eliminando.update((ids) => [...ids, estudiante.id]);

this.api.eliminar(estudiante.id).subscribe({
  next: () => {
    this.estudiantes.update((actuales) =>
      actuales.filter((e) => e.id !== estudiante.id),
    );
    this.seleccionados.update((ids) =>
      ids.filter((id) => id !== estudiante.id),
    );
    this.mensaje.set(`Se eliminó a ${estudiante.nombre} correctamente.`);
    this.eliminando.update((ids) =>
      ids.filter((id) => id !== estudiante.id),
    );
  },
  error: () => {
    this.mensaje.set(
      `No se pudo eliminar a ${estudiante.nombre}. Verifica que la API esté activa.`,
    );
    this.eliminando.update((ids) =>
      ids.filter((id) => id !== estudiante.id),
    );
  },
});

}

cargar(): void {
this.cargando.set(true);
this.error.set(false);
this.mensaje.set('');

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