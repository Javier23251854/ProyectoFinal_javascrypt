import { Component, inject, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AlojamientoService } from '../core/services/alojamiento.service';
import { Alojamiento } from '../models/alojamiento';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './buscar.html',
  styleUrl: './buscar.css'
})
export class Buscar implements OnInit {

  private fb = inject(FormBuilder);
  private alojamientoService = inject(AlojamientoService);
  private cdr = inject(ChangeDetectorRef);

  alojamientos: Alojamiento[] = [];
  resultados: Alojamiento[] = [];

  formularioBusqueda = this.fb.group({
    busqueda: [''],
    departamento: [''],
    provincia: [''],
    distrito: [''],
    tipo: [''],
    precioMaximo: [''],
    ordenar: ['recientes']
  });

  ngOnInit(): void {
    this.alojamientoService.obtenerAlojamientos().subscribe({
      next: (datos) => {
        console.log('ALOJAMIENTOS RECIBIDOS:', datos);

        this.alojamientos = datos;
        this.resultados = [...datos];

        console.log('RESULTADOS:', this.resultados);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar alojamientos:', error);
      }
    });
  }

  aplicarFiltros(): void {
    const filtros = this.formularioBusqueda.value;

    const texto = (filtros.busqueda || '').trim().toLowerCase();
    const departamento = filtros.departamento || '';
    const provincia = filtros.provincia || '';
    const distrito = filtros.distrito || '';
    const tipo = filtros.tipo || '';
    const precioMaximo = Number(filtros.precioMaximo) || Infinity;

    this.resultados = this.alojamientos.filter((alojamiento) => {

      const coincideTexto =
        texto === '' ||
        alojamiento.titulo.toLowerCase().includes(texto) ||
        alojamiento.distrito.toLowerCase().includes(texto);

      const coincideDepartamento =
        departamento === '' ||
        alojamiento.departamento === departamento;

      const coincideProvincia =
        provincia === '' ||
        alojamiento.provincia === provincia;

      const coincideDistrito =
        distrito === '' ||
        alojamiento.distrito === distrito;

      const coincideTipo =
        tipo === '' ||
        alojamiento.tipo === tipo;

      const coincidePrecio =
        alojamiento.precio <= precioMaximo;

      return (
        coincideTexto &&
        coincideDepartamento &&
        coincideProvincia &&
        coincideDistrito &&
        coincideTipo &&
        coincidePrecio
      );
    });

    this.ordenarResultados();
  }

  ordenarResultados(): void {
    const criterio = this.formularioBusqueda.value.ordenar;

    if (criterio === 'precio-asc') {
      this.resultados.sort((a, b) => a.precio - b.precio);
    }

    if (criterio === 'precio-desc') {
      this.resultados.sort((a, b) => b.precio - a.precio);
    }

    if (criterio === 'recientes') {
      this.resultados.sort(
        (a, b) =>
          new Date(b.fecha).getTime() -
          new Date(a.fecha).getTime()
      );
    }
  }

  limpiarFiltros(): void {
    this.formularioBusqueda.reset({
      busqueda: '',
      departamento: '',
      provincia: '',
      distrito: '',
      tipo: '',
      precioMaximo: '',
      ordenar: 'recientes'
    });

    this.resultados = [...this.alojamientos];

    this.ordenarResultados();
  }
}