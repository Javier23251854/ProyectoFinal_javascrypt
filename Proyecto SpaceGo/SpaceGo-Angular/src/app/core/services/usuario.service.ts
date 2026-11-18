import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, map, shareReplay, tap } from 'rxjs';
import { Usuario } from '../../models/usuario';

interface Sesion {
  usuario: Usuario | null;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private sesion = signal<Usuario | null>(null);
  readonly usuario = this.sesion.asReadonly();
  private consulta?: Observable<Usuario | null>;
  private revision = 0;

  comprobarSesion(): Observable<Usuario | null> {
    if (!this.consulta) {
      const revision = this.revision;
      this.consulta = this.http.get<Sesion>('/api/auth/sesion').pipe(
        map(({ usuario }) => {
          if (revision === this.revision) this.sesion.set(usuario);
          return this.usuario();
        }),
        finalize(() => this.consulta = undefined),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.consulta;
  }

  registrarUsuario(datos: { name: string; email: string; password: string }): Observable<Usuario> {
    return this.http.post<Usuario>('/api/auth/registro', datos);
  }

  iniciarSesion(email: string, password: string, remember: boolean): Observable<Usuario | null> {
    return this.http.post<Sesion>('/api/auth/login', { email, password, remember }).pipe(
      map(({ usuario }) => usuario),
      tap(usuario => {
        this.revision++;
        this.sesion.set(usuario);
      }),
    );
  }

  cerrarSesion(): Observable<void> {
    return this.http.post<void>('/api/auth/salir', null).pipe(tap(() => {
      this.revision++;
      this.sesion.set(null);
    }));
  }
}
