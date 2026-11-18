import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { UsuarioService } from '../core/services/usuario.service';
import { esRutaPrivada } from '../core/sesion.guard';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder).nonNullable;
  private auth = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  vistaRegistro = false;
  mensajeRegistro = signal('');
  errorRegistro = signal('');
  errorLogin = signal('');
  enviando = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
    remember: [false],
  });

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
    terms: [false, Validators.requiredTrue],
  });

  mostrarLogin(): void {
    this.vistaRegistro = false;
    this.errorLogin.set('');
  }

  mostrarRegistro(): void {
    this.vistaRegistro = true;
    this.mensajeRegistro.set('');
    this.errorRegistro.set('');
  }

  iniciarSesion(): void {
    if (this.enviando()) return;
    this.errorLogin.set('');
    this.mensajeRegistro.set('');
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, remember } = this.loginForm.getRawValue();
    this.enviando.set(true);
    this.auth.iniciarSesion(email, password, remember).pipe(
      finalize(() => this.enviando.set(false)),
    ).subscribe({
      next: () => {
        const destino = this.route.snapshot.queryParamMap.get('volver') ?? '';
        const ruta = esRutaPrivada(destino) ? destino : '/';
        window.location.replace(ruta);
      },
      error: (error: HttpErrorResponse) => this.errorLogin.set(
        error.error?.mensaje ?? 'No se pudo conectar con SpaceGo. Inténtalo nuevamente.',
      ),
    });
  }

  registrarse(): void {
    if (this.enviando()) return;
    this.errorRegistro.set('');
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.getRawValue();
    this.enviando.set(true);
    this.auth.registrarUsuario({ name, email, password }).pipe(
      finalize(() => this.enviando.set(false)),
    ).subscribe({
      next: () => {
        this.registerForm.reset();
        this.loginForm.reset({ email });
        this.mostrarLogin();
        this.mensajeRegistro.set('Cuenta creada. Ya puedes iniciar sesión.');
      },
      error: (error: HttpErrorResponse) => this.errorRegistro.set(
        error.error?.mensaje ?? 'No se pudo crear la cuenta. Inténtalo nuevamente.',
      ),
    });
  }
}
