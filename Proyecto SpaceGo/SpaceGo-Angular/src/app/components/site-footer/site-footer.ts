import { UsuarioService } from '../../core/services/usuario.service';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css'
})
export class SiteFooter {
  protected auth = inject(UsuarioService);
}