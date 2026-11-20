import {
Component,
DestroyRef,
inject,
OnInit,
signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
AbstractControl,
FormBuilder,
ReactiveFormsModule,
Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import type { Programa, BorradorEstudiante } from '../../modelos/estudiante';
import { EstudiantesApi } from '../../core/services/estudiantes-api';

function nombreValido(control: AbstractControl) {
const texto = String(control.value ?? '').trim();
return texto.length >= 3 && texto.length <= 80
? null
: { nombre: true };
}

function numeroFinito(control: AbstractControl) {
return control.value === null || Number.isFinite(control.value)
? null
: { finito: true };
}

@Component({
selector: 'app-registro',
standalone: true,
imports: [ReactiveFormsModule, RouterLink],
template: `
<main class="container py-4">
<h1>{{ id() ? 'Editar estudiante' : 'Registrar estudiante' }}</h1>
<p>Completa los datos académicos del estudiante.</p>

  @if (cargando()) {
    <p>Cargando información...</p>
  } @else {
    @if (errorCarga()) {
      <p class="alert alert-danger" role="alert">{{ errorCarga() }}</p>
      <a routerLink="/estudiantes" class="btn btn-secondary">
        Volver a estudiantes
      </a>
    } @else {
      @if (errorGuardado()) {
        <p class="alert alert-danger" role="alert">{{ errorGuardado() }}</p>
      }

      @if (mensaje()) {
        <p class="alert alert-success" role="status">{{ mensaje() }}</p>
      }

      <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre completo</label>
          <input
            id="nombre"
            type="text"
            class="form-control"
            formControlName="nombre"
            maxlength="80"
            required
            [class.is-invalid]="form.controls.nombre.invalid &&
              (form.controls.nombre.touched || enviado())"
          />
          @if (form.controls.nombre.invalid &&
            (form.controls.nombre.touched || enviado())) {
            <div class="invalid-feedback">
              Escribe un nombre de entre 3 y 80 caracteres.
            </div>
          }
        </div>

        <div class="mb-3">
          <label for="programa" class="form-label">Programa</label>
          <select
            id="programa"
            class="form-select"
            formControlName="programa"
            required
          >
            <option value="Software">Software</option>
            <option value="Sistemas">Sistemas</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="promedio" class="form-label">Promedio (0 a 20)</label>
          <input
            id="promedio"
            type="number"
            class="form-control"
            formControlName="promedio"
            min="0"
            max="20"
            step="0.1"
            required
            [class.is-invalid]="form.controls.promedio.invalid &&
              (form.controls.promedio.touched || enviado())"
          />
          @if (form.controls.promedio.invalid &&
            (form.controls.promedio.touched || enviado())) {
            <div class="invalid-feedback">
              Ingresa un promedio entre 0 y 20.
            </div>
          }
        </div>

        <div class="mb-3">
          <label for="asistencia" class="form-label">
            Asistencia (0 a 100 %)
          </label>
          <input
            id="asistencia"
            type="number"
            class="form-control"
            formControlName="asistencia"
            min="0"
            max="100"
            step="1"
            required
            [class.is-invalid]="form.controls.asistencia.invalid &&
              (form.controls.asistencia.touched || enviado())"
          />
          @if (form.controls.asistencia.invalid &&
            (form.controls.asistencia.touched || enviado())) {
            <div class="invalid-feedback">
              Ingresa una asistencia entre 0 y 100.
            </div>
          }
        </div>

        <button
          type="submit"
          class="btn btn-primary me-2"
          [disabled]="guardando() || form.disabled"
        >
          {{ guardando() ? 'Guardando...' : 'Guardar' }}
        </button>

        <a routerLink="/estudiantes" class="btn btn-outline-secondary">
          Cancelar
        </a>
      </form>
    }
  }
</main>

`,
})
export class Registro implements OnInit {
private readonly fb = inject(FormBuilder);
private readonly api = inject(EstudiantesApi);
private readonly route = inject(ActivatedRoute);
private readonly router = inject(Router);
private readonly destroyRef = inject(DestroyRef);

readonly id = signal<string | null>(null);
readonly cargando = signal(false);
readonly guardando = signal(false);
readonly enviado = signal(false);
readonly mensaje = signal('');
readonly errorCarga = signal('');
readonly errorGuardado = signal('');

readonly form = this.fb.group({
nombre: this.fb.nonNullable.control('', [nombreValido]),
programa: this.fb.nonNullable.control<Programa>('Software', [
Validators.required,
]),
promedio: this.fb.control<number | null>(null, [
Validators.required,
Validators.min(0),
Validators.max(20),
numeroFinito,
]),
asistencia: this.fb.control<number | null>(null, [
Validators.required,
Validators.min(0),
Validators.max(100),
numeroFinito,
]),
});

ngOnInit(): void {
this.route.paramMap
.pipe(
tap((params) => {
this.id.set(params.get('id'));
this.cargando.set(true);
this.errorCarga.set('');
this.errorGuardado.set('');
this.mensaje.set('');
this.enviado.set(false);
this.form.reset({
nombre: '',
programa: 'Software',
promedio: null,
asistencia: null,
});
this.form.disable();
}),
switchMap(() => {
const id = this.id();
return id
? this.api.obtener(id).pipe(
catchError(() => {
this.errorCarga.set(
'No se pudo cargar el estudiante. Verifica que la API esté activa.',
);
return of(null);
}),
)
: of(null);
}),
takeUntilDestroyed(this.destroyRef),
)
.subscribe((estudiante) => {
if (estudiante) {
this.form.patchValue({
nombre: estudiante.nombre,
programa: estudiante.programa,
promedio: estudiante.promedio,
asistencia: estudiante.asistencia,
});
}

    if (!this.errorCarga()) {
      this.form.enable();
    }

    this.cargando.set(false);
  });

}

guardar(): void {
this.enviado.set(true);
this.errorGuardado.set('');

if (this.form.invalid || this.guardando()) {
  this.form.markAllAsTouched();
  return;
}

const valores = this.form.getRawValue();
const promedio = valores.promedio;
const asistencia = valores.asistencia;

if (promedio === null || asistencia === null) {
  this.form.markAllAsTouched();
  return;
}

const estudiante: BorradorEstudiante = {
  nombre: valores.nombre.trim(),
  programa: valores.programa,
  promedio,
  asistencia,
};

this.guardando.set(true);
this.form.disable();

const id = this.id();
const solicitud = id
  ? this.api.actualizar(id, estudiante)
  : this.api.crear(estudiante);

solicitud
  .pipe(
    finalize(() => {
      this.guardando.set(false);
      if (!this.errorCarga()) {
        this.form.enable();
      }
    }),
    takeUntilDestroyed(this.destroyRef),
  )
  .subscribe({
    next: (guardado) => {
      this.mensaje.set(
        `Estudiante guardado correctamente. ID: ${guardado.id}`,
      );
      this.form.reset({
        nombre: '',
        programa: 'Software',
        promedio: null,
        asistencia: null,
      });
      this.enviado.set(false);

      void this.router.navigate(['/estudiantes']);
    },
    error: () => {
      this.errorGuardado.set(
        'No se pudo guardar el estudiante. Verifica que la API esté activa e inténtalo de nuevo.',
      );
    },
  });

}
}