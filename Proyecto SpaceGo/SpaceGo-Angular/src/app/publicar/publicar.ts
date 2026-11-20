
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AlojamientoService } from '../core/services/alojamiento.service';

interface Provincia {
  nombre: string;
  distritos: string[];
}

interface Departamento {
  nombre: string;
  provincias: Provincia[];
}

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './publicar.html',
  styleUrl: './publicar.css'
})
export class Publicar {

  private fb = inject(FormBuilder);
  private alojamientoService = inject(AlojamientoService);

  pasoActual = 1;
  totalPasos = 5;
  pasoMaximo = 1;

  formulario = this.fb.group({
    titulo: ['', [
      Validators.required,
      Validators.maxLength(60)
    ]],

    tipo: ['', Validators.required],

    precio: ['', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/)
    ]],

    descripcion: ['', [
      Validators.required,
      Validators.maxLength(300)
    ]],

    correo: ['', [
      Validators.required,
      Validators.email
    ]],

    telefono: ['', [
      Validators.required,
      Validators.pattern(/^\d{9}$/)
    ]],

    departamento: ['', Validators.required],

    provincia: ['', Validators.required],

    distrito: ['', Validators.required],

    referencia: ['', [
      Validators.required,
      Validators.maxLength(120)
    ]],

    caracteristicas: [[] as string[]],

    fotos: this.fb.control<File[] | null>(null)
  });

  ubicaciones: Departamento[] = [
    {
      nombre: 'Lima',
      provincias: [{
        nombre: 'Lima',
        distritos: [
          'San Miguel',
          'San Isidro',
          'Miraflores',
          'Surco',
          'Barranco',
          'San Borja',
          'La Molina',
          'Los Olivos',
          'San Juan de Lurigancho'
        ]
      }]
    },

    {
      nombre: 'Arequipa',
      provincias: [{
        nombre: 'Arequipa',
        distritos: [
          'Arequipa',
          'Cayma',
          'Cerro Colorado',
          'Yanahuara'
        ]
      }]
    },

    {
      nombre: 'Cusco',
      provincias: [{
        nombre: 'Cusco',
        distritos: [
          'Cusco',
          'San Sebastián',
          'San Jerónimo',
          'Santiago'
        ]
      }]
    },

    {
      nombre: 'La Libertad',
      provincias: [{
        nombre: 'Trujillo',
        distritos: [
          'Trujillo',
          'Víctor Larco Herrera',
          'Huanchaco',
          'La Esperanza',
          'El Porvenir'
        ]
      }]
    },

    {
      nombre: 'Piura',
      provincias: [{
        nombre: 'Piura',
        distritos: [
          'Piura',
          'Castilla',
          'Veintiséis de Octubre'
        ]
      }]
    },

    {
      nombre: 'Lambayeque',
      provincias: [{
        nombre: 'Chiclayo',
        distritos: [
          'Chiclayo',
          'José Leonardo Ortiz',
          'La Victoria',
          'Pimentel'
        ]
      }]
    },

    {
      nombre: 'Junín',
      provincias: [{
        nombre: 'Huancayo',
        distritos: [
          'Huancayo',
          'El Tambo',
          'Chilca'
        ]
      }]
    },

    {
      nombre: 'Ica',
      provincias: [{
        nombre: 'Ica',
        distritos: [
          'Ica',
          'Parcona',
          'La Tinguiña'
        ]
      }]
    },

    {
      nombre: 'Tacna',
      provincias: [{
        nombre: 'Tacna',
        distritos: [
          'Tacna',
          'Alto de la Alianza',
          'Ciudad Nueva',
          'Gregorio Albarracín'
        ]
      }]
    },

    {
      nombre: 'Puno',
      provincias: [
        {
          nombre: 'Puno',
          distritos: [
            'Puno',
            'Acora',
            'Chucuito'
          ]
        },
        {
          nombre: 'San Román',
          distritos: [
            'Juliaca',
            'Cabana',
            'Cabanillas'
          ]
        }
      ]
    },

    {
      nombre: 'Áncash',
      provincias: [{
        nombre: 'Huaraz',
        distritos: [
          'Huaraz',
          'Independencia',
          'Jangas'
        ]
      }]
    }
  ];

  departamentoSeleccionado = '';
  provinciaSeleccionada = '';
  distritoSeleccionado = '';

  provinciasDisponibles: Provincia[] = [];
  distritosDisponibles: string[] = [];

  caracteristicasSeleccionadas = new Set<string>();

  fotosSeleccionadas: File[] = [];

  previsualizacionesFotos: string[] = [];

  private limpiarPrevisualizaciones(): void {
    this.previsualizacionesFotos.forEach(url => {
      URL.revokeObjectURL(url);
    });

    this.previsualizacionesFotos = [];
  }

  cambiarDepartamento(nombre: string): void {
    this.departamentoSeleccionado = nombre;
    this.provinciaSeleccionada = '';
    this.distritoSeleccionado = '';

    const departamento = this.ubicaciones.find(
      item => item.nombre === nombre
    );

    this.provinciasDisponibles =
      departamento?.provincias ?? [];

    this.distritosDisponibles = [];

    this.formulario.patchValue({
      departamento: nombre,
      provincia: '',
      distrito: ''
    });
  }

  cambiarProvincia(nombre: string): void {
    this.provinciaSeleccionada = nombre;
    this.distritoSeleccionado = '';

    const provincia = this.provinciasDisponibles.find(
      item => item.nombre === nombre
    );

    this.distritosDisponibles =
      provincia?.distritos ?? [];

    this.formulario.patchValue({
      provincia: nombre,
      distrito: ''
    });
  }

  cambiarDistrito(nombre: string): void {
    this.distritoSeleccionado = nombre;

    this.formulario.patchValue({
      distrito: nombre
    });
  }

  cambiarReferencia(valor: string): void {
    this.formulario.patchValue({
      referencia: valor
    });
  }

  cambiarCaracteristica(
    event: Event,
    caracteristica: string
  ): void {
    const input = event.target as HTMLInputElement;

    if (input.checked) {
      this.caracteristicasSeleccionadas.add(caracteristica);
    } else {
      this.caracteristicasSeleccionadas.delete(caracteristica);
    }

    this.formulario.patchValue({
      caracteristicas: [
        ...this.caracteristicasSeleccionadas
      ]
    });
  }

  seleccionarFotos(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) {
      return;
    }

    this.limpiarPrevisualizaciones();

    this.fotosSeleccionadas =
      Array.from(input.files).slice(0, 3);

    this.previsualizacionesFotos =
      this.fotosSeleccionadas.map(foto =>
        URL.createObjectURL(foto)
      );

    this.formulario.patchValue({
      fotos: this.fotosSeleccionadas
    });

    // Permite volver a seleccionar los mismos archivos.
    input.value = '';
  }

  obtenerUbicacionCompleta(): string {
    const {
      departamento,
      provincia,
      distrito
    } = this.formulario.value;

    return [
      departamento,
      provincia,
      distrito
    ]
      .filter(Boolean)
      .join(', ');
  }

  irAlPaso(paso: number): void {
    if (!this.puedeIrAlPaso(paso)) {
      return;
    }

    this.pasoActual = paso;
  }

  siguientePaso(): void {
    if (this.pasoActual >= this.totalPasos) {
      return;
    }

    this.pasoActual++;

    if (this.pasoActual > this.pasoMaximo) {
      this.pasoMaximo = this.pasoActual;
    }
  }

  pasoAnterior(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  puedeIrAlPaso(paso: number): boolean {
    return paso <= this.pasoMaximo;
  }

  guardarYPublicar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.value;

    // Primero se suben las fotografías.
    // Después se crea el alojamiento con sus direcciones.
    const crearPublicacion = (rutasImagenes: string[]): void => {

      const nuevoAlojamiento = {
        titulo: datos.titulo || '',
        tipo: datos.tipo || '',
        precio: Number(datos.precio) || 0,
        departamento: datos.departamento || '',
        provincia: datos.provincia || '',
        distrito: datos.distrito || '',

        imagen: rutasImagenes[0] || '/Imagenes/logo cuarto.png',
        imagenes: rutasImagenes,

        descripcion: datos.descripcion || '',

        contacto: {
          telefono: datos.telefono || '',
          correo: datos.correo || ''
        },

        referencia: datos.referencia || '',
        caracteristicas: datos.caracteristicas || [],

        fecha: new Date().toISOString().split('T')[0]
      };

      this.alojamientoService
        .crearAlojamiento(nuevoAlojamiento)
        .subscribe({

          next: (respuesta) => {
            console.log(
              'Alojamiento publicado:',
              respuesta
            );

            this.limpiarFormulario();

            alert(
              '¡Alojamiento publicado correctamente!'
            );
          },

          error: (error) => {
            console.error(
              'Error al publicar alojamiento:',
              error
            );

            alert(
              'No se pudo publicar el alojamiento.'
            );
          }

        });
    };

    // Si se seleccionaron fotografías, se suben primero.
    if (this.fotosSeleccionadas.length > 0) {

      this.alojamientoService
        .subirImagenes(this.fotosSeleccionadas)
        .subscribe({

          next: (respuesta) => {
            crearPublicacion(respuesta.imagenes);
          },

          error: (error) => {
            console.error(
              'Error al subir las fotografías:',
              error
            );

            alert(
              'No se pudieron subir las fotografías. El alojamiento no fue publicado.'
            );
          }

        });

    } else {
      // Si no se seleccionaron fotografías,
      // se conserva el logo como imagen predeterminada.
      crearPublicacion([]);
    }
  }

  private limpiarFormulario(): void {

    this.formulario.reset({
      titulo: '',
      tipo: '',
      precio: '',
      descripcion: '',
      correo: '',
      telefono: '',
      departamento: '',
      provincia: '',
      distrito: '',
      referencia: '',
      caracteristicas: [],
      fotos: null
    });

    this.caracteristicasSeleccionadas.clear();
    this.fotosSeleccionadas = [];
    this.limpiarPrevisualizaciones();
    this.departamentoSeleccionado = '';
    this.provinciaSeleccionada = '';
    this.distritoSeleccionado = '';

    this.provinciasDisponibles = [];
    this.distritosDisponibles = [];

    this.pasoActual = 1;
    this.pasoMaximo = 1;
  }
}
