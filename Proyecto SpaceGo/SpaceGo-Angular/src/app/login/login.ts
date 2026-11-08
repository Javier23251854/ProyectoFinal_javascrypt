import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../core/services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  vistaRegistro = false;

  mensajeRegistro = '';
  errorRegistro = '';
  mensajeLogin = '';
  errorLogin = '';
  urlMiPerfil = '';

  mostrarLogin(): void {
    this.vistaRegistro = false;
    this.mensajeRegistro = '';
    this.errorRegistro = '';
  }

  mostrarRegistro(): void {
    this.vistaRegistro = true;
    this.mensajeRegistro = '';
    this.errorRegistro = '';
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [false]
  });

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, Validators.requiredTrue]
  });

  iniciarSesion(): void {

    this.mensajeLogin = '';
    this.errorLogin = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.get('email')?.value?.trim().toLowerCase() ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    this.usuarioService.validarCredenciales(email, password).subscribe({

      next: (usuario) => {

        this.mensajeLogin = `¡Bienvenido, ${usuario.name}! Has iniciado sesión correctamente.`;

        this.urlMiPerfil = `http://localhost:5173/mi-perfil?usuarioId=${encodeURIComponent(String(usuario.id))}`;

        this.loginForm.reset({
          email: '',
          password: '',
          remember: false
        });

      },

      error: () => {
        this.errorLogin = 'Correo o contraseña incorrectos.';
      }

    });
  }

  registrarse(): void {

    this.mensajeRegistro = '';
    this.errorRegistro = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const datos = this.registerForm.getRawValue();

    const nuevoUsuario = {
      name: datos.name!.trim(),
      email: datos.email!.trim().toLowerCase(),
      password: datos.password!
    };

    this.usuarioService.registrarUsuario(nuevoUsuario).subscribe({

      next: () => {
        this.mensajeRegistro = '¡Cuenta creada correctamente! Ya puedes iniciar sesión.';

        this.registerForm.reset({
          name: '',
          email: '',
          password: '',
          terms: false
        });
      },

      error: (error) => {
        this.errorRegistro = error.message === 'Este correo ya está registrado.'
          ? error.message
          : 'No se pudo crear la cuenta. Verifica que el servidor esté funcionando.';
      }

    });
  }
}