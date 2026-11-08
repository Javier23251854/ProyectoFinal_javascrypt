import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/usuarios';

  registrarUsuario(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {

    const url = `${this.apiUrl}?email=${encodeURIComponent(usuario.email)}`;

    return this.http.get<Usuario[]>(url).pipe(
      switchMap(usuarios => {

        if (usuarios.length > 0) {
          return throwError(() => new Error('Este correo ya está registrado.'));
        }

        return this.http.post<Usuario>(this.apiUrl, usuario);
      })
    );
  }
    validarCredenciales(email: string, password: string): Observable<Usuario> {

    const url = `${this.apiUrl}?email=${encodeURIComponent(email)}`;

    return this.http.get<Usuario[]>(url).pipe(
      switchMap(usuarios => {
        const usuario = usuarios.find(
          item => item.password === password
        );

        if (!usuario) {
          return throwError(() => new Error('Correo o contraseña incorrectos.'));
        }

        return new Observable<Usuario>(subscriber => {
          subscriber.next(usuario);
          subscriber.complete();
        });
      })
    );
  }
}