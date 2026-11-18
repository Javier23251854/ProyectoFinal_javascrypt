import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SiteFooter } from './components/site-footer/site-footer';
import { UsuarioService } from './core/services/usuario.service';
import { esRutaPrivada } from './core/sesion.guard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected auth = inject(UsuarioService);
  private router = inject(Router);
  menuAbierto = false;
  cerrandoSesion = false;
  errorSesion = '';

  ngOnInit(): void {
    this.actualizarSesion();
  }

  @HostListener('window:pageshow')
  @HostListener('document:visibilitychange')
  actualizarSesion(): void {
    if (document.visibilityState === 'hidden') return;
    this.auth.comprobarSesion().subscribe({
      next: usuario => {
        if (!usuario && esRutaPrivada(this.router.url)) {
          void this.router.navigate(['/login'], {
            queryParams: { volver: this.router.url }, replaceUrl: true,
          });
        }
      },
      error: () => { /* El formulario muestra errores al intentar iniciar sesión. */ },
    });
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  cerrarSesion(): void {
    if (this.cerrandoSesion) return;
    this.cerrandoSesion = true;
    this.errorSesion = '';
    this.auth.cerrarSesion().subscribe({
      next: () => {
        this.cerrandoSesion = false;
        this.cerrarMenu();
        void this.router.navigateByUrl('/', { replaceUrl: true });
      },
      error: () => {
        this.cerrandoSesion = false;
        this.errorSesion = 'No se pudo cerrar la sesión. Inténtalo nuevamente.';
      },
    });
  }
}
