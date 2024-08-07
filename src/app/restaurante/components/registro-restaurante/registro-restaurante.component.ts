
// registro-restaurante.component.ts
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MensajeComponent } from '../../../compartido/components/mensaje/mensaje.component';
import { AuthrestauranteService } from '../../services/authrestaurante.service';

import { AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-registro-restaurante',
  templateUrl: './registro-restaurante.component.html',
  styleUrls: ['./registro-restaurante.component.css']
})
export class RegistroRestauranteComponent implements OnInit {

  private map!: google.maps.Map;
  private marker!: google.maps.Marker;
  private geocoder!: google.maps.Geocoder;

  // Atributos para mostrar las imágenes previas
  public prevMenu: string = '';
  public previdentificacionOficial: string = '';
  public prevconstanciaFiscal: string = '';
  public prevestadoCuentaBancaria: string = '';
  public prevlicenciaFuncionamiento: string = '';

  // Arreglos para almacenar los archivos seleccionados
  public menuImagenFile: any = [];
  public identificacionOficialFile: any = [];
  public constanciaFiscalFile: any = [];
  public estadoCuentaBancariaFile: any = [];
  public licenciaFuncionamientoFile: any = [];

  // Definición de formularios y variables de control
  registroForm: FormGroup;
  segundaFaseForm: FormGroup;
  terceraFaseForm: FormGroup;
  cuartaFaseForm: FormGroup;
  categoriaRestaurante: string[] = [
    'Asiática', 'Bar de Vinos', 'Buffet', 'Carnes a la Parrilla', 'Cafetería', 'Comida Caribeña', 'Comida del Medio Oriente',
    'Comida Rápida', 'Comida Regional', 'Comida Tradicional Mexicana', 'Cocina Centroamericana', 'Cocina Sudamericana', 'Dulcería',
    'Francesa', 'Fonda', 'Gourmet', 'Hamburguesas', 'Italiana', 'Mariscos', 'Mediterránea', 'Mexicana', 'Pastas', 'Pastelería',
    'Panes y Pasteles', 'Pizzería', 'Postres', 'Sandwiches', 'Tacos', 'Tortas', 'Vegana', 'Bebidas y Cócteles'
];
  isCaptchaVerified: boolean = false;
  recaptchaSiteKey: string = '6Le6alYpAAAAAHIWXN8HgHQ19z60gq0e3YCSz5qY';
  mostrarModalAvisosPrivacidad: boolean = false; // Variable para mostrar/ocultar el modal
  private synth!: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null!;

  hidePassword: boolean = true; // Variable para ocultar/mostrar contraseña
  faseActual: 'primera' | 'segunda' | 'tercera' | 'cuarta' = 'primera'; // Variable para controlar la fase del registro

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private authRestauranteService: AuthrestauranteService,
 
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
  ) {

    // Inicialización de formularios
    this.registroForm = this.fb.group({
      nombreRestaurante: ['', Validators.required],
      correoRestaurante: ['', [Validators.required, Validators.email]],
      telefonoRestaurante: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      encargadoRestaurante: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      direccionRestaurante: ['', Validators.required],
      apellidoEncargado: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d#$&*]{8,}$/)]],
      preguntaSecreta: ['', Validators.required], // Agrega la pregunta secreta al formulario
      respuestaSecreta: ['', Validators.required], // Agrega la respuesta secreta al formulario
    });

    this.segundaFaseForm = this.fb.group({
      numeroRestaurante: ['', Validators.required],
      razonSocial: ['', Validators.required],
      domicilioFiscal: ['', Validators.required],
      horaApertura: ['', Validators.required],
      horaCierre: ['', Validators.required],
      aceptarPrivacidad: [false, Validators.requiredTrue],
      menuImagen: [null, Validators.required], // Campo de carga de archivo
      categoriaRestaurante: ['', Validators.required] // Campo de selección de categorías
    });

    this.terceraFaseForm = this.fb.group({
      nombreTitular: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      numeroCLABE: ['', Validators.required],
    });

    this.cuartaFaseForm = this.fb.group({
      identificacionOficial: [null, Validators.required], // Campo de carga de archivo
      constanciaFiscal: [null, Validators.required], // Campo de carga de archivo
      estadoCuentaBancaria: [null, Validators.required], // Campo de carga de archivo
      licenciaFuncionamiento: [null, Validators.required], // Campo de carga de archivo
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleMapsAPI();
    }
  }

  loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDTeWeCxH4zCEyvVPD8_t1Rg8lUHlVGSj0&libraries=places`;
    document.body.appendChild(script);
    script.onload = () => {
      this.initializeMap();
      this.initializeAutocomplete();
    };

    script.onerror = () => {
      console.error('Failed to load the Google Maps API script.');
    };
  }

  initializeMap() {
    const mapElement = document.getElementById('map') as HTMLElement;
    this.map = new google.maps.Map(mapElement, {
      center: { lat: -33.8688, lng: 151.2195 }, // Coordenadas de ejemplo, personalizables
      zoom: 13,
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      visible: false,
    });

    this.geocoder = new google.maps.Geocoder();

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.geocodeLatLng(event.latLng);
      }
    });
  }

  initializeAutocomplete() {
    const input = document.getElementById('direccionRestaurante') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        window.alert('No details available for input: ' + place.name);
        return;
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }

      this.marker.setPosition(place.geometry.location);
      this.marker.setVisible(true);

      // Asigna el valor seleccionado al campo de dirección del restaurante
      this.registroForm.get('direccionRestaurante')?.setValue(place.formatted_address || place.name || '');
      this.cdr.detectChanges();
    });
  }

  geocodeLatLng(latLng: google.maps.LatLng | google.maps.LatLngLiteral) {
    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results) {
        this.map.setCenter(latLng);
        this.map.setZoom(17);
        this.marker.setPosition(latLng);
        this.marker.setVisible(true);

        // Asigna el valor geocodificado al campo de dirección del restaurante
        this.registroForm.get('direccionRestaurante')?.setValue(results[0].formatted_address);
        this.cdr.detectChanges();
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  handleCaptchaChange(value: string | null) {
    this.isCaptchaVerified = value !== null;
  }
  toggleVozAlta() {
    const enableVozAlta = document.getElementById('enableVozAlta') as HTMLInputElement;
    this.synth = window.speechSynthesis;
  
    const elementos = document.querySelectorAll('a, img, h1, p, h2, .title, .option, label, button' );
  
    elementos.forEach(elemento => {
      elemento.addEventListener('mouseover', () => {
        if (enableVozAlta.checked) {
          if (this.synth.speaking && this.utterance) {
            this.synth.cancel();
          }
  
          let texto = '';
  
          // Verificar si el elemento es una imagen antes de acceder a 'alt'
          if (elemento instanceof HTMLImageElement) {
            texto = elemento.alt;
          } else if (elemento instanceof HTMLElement) {
            texto = elemento.innerText || elemento.textContent || '';
          }
  
          if (texto.trim() !== '') {
            this.utterance = new SpeechSynthesisUtterance(texto);
            this.synth.speak(this.utterance);
          }
        }
      });
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      passwordInput.setAttribute('type', this.hidePassword ? 'password' : 'text');
    }
  }

  mostrarAvisosPrivacidad() {
    // Muestra el modal de AvisosPrivacidadComponent solo si aún no está visible
    if (!this.mostrarModalAvisosPrivacidad) {
      this.mostrarModalAvisosPrivacidad = true;
    }
  }
  
  cerrarAvisosPrivacidad() {
    // Cierra el modal de AvisosPrivacidadComponent
    this.mostrarModalAvisosPrivacidad = false;
  }

  cambiarFase(fase: 'primera' | 'segunda' | 'tercera' | 'cuarta') {
    this.faseActual = fase;
  }

  volverAFaseAnterior() {
    this.cambiarFase('primera');
  }

  // Métodos para capturar imágenes y mostrar vistas previas
  capturarImagenmenu(event: any) {
    const menuImagencapturado = event.target.files[0];
    this.extraerBase64(menuImagencapturado).then((imagen: any) => {
      this.prevMenu = imagen.base;
    })
    this.menuImagenFile.push(menuImagencapturado);
  }

  capturarImagenidentificacionOficial(event: any) {
    const identificacionOficialcapturado = event.target.files[0];
    this.extraerBase64(identificacionOficialcapturado).then((imagen: any) => {
      this.previdentificacionOficial = imagen.base;
    })
    this.identificacionOficialFile.push(identificacionOficialcapturado);
  }

  capturarImagenconstanciaFiscal(event: any) {
    const constanciaFiscacapturado = event.target.files[0];
    this.extraerBase64(constanciaFiscacapturado).then((imagen: any) => {
      this.prevconstanciaFiscal = imagen.base;
    })
    this.constanciaFiscalFile.push(constanciaFiscacapturado);
  }

  capturarImagenestadoCuentaBancaria(event: any) {
    const estadoCuentaBancariacapturado = event.target.files[0];
    this.extraerBase64(estadoCuentaBancariacapturado).then((imagen: any) => {
      this.prevestadoCuentaBancaria = imagen.base;
    })
    this.estadoCuentaBancariaFile.push(estadoCuentaBancariacapturado);
  }

  capturarImagenlicenciaFuncionamiento(event: any) {
    const licenciaFuncionamientocapturado = event.target.files[0];
    this.extraerBase64(licenciaFuncionamientocapturado).then((imagen: any) => {
      this.prevlicenciaFuncionamiento = imagen.base;
    })
    this.licenciaFuncionamientoFile.push(licenciaFuncionamientocapturado);
  }

  extraerBase64($event: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const reader = new FileReader();

        reader.onload = () => {
          resolve({
            blob: $event,
            image: unsafeImg,
            base: reader.result
          });
        };

        reader.onerror = error => {
          reject(error);
        };

        reader.readAsDataURL($event);
      } catch (e) {
        reject(e);
      }
    });
  }

  // Métodos para registrar el restaurante en cada fase
  registrar(): void {
    if (this.registroForm.valid) {
      console.log('Información registrada:', this.registroForm.value);
      this.cambiarFase('segunda');
    }
  }

  registrarFaseDos(): void {
    if (this.segundaFaseForm.valid) {
      console.log('Información registrada:', this.segundaFaseForm.value);
      this.cambiarFase('tercera');
    }
  }

  registrarFaseTres(): void {
    if (this.terceraFaseForm.valid) {
      console.log('Información registrada:', this.terceraFaseForm.value);
      this.cambiarFase('cuarta');
    }
  }

  registrarFaseCuatro(): void {
    try {
      if (this.cuartaFaseForm.valid) {
        console.log('Datos del formulario de la cuarta fase:', this.cuartaFaseForm.value);
  
        const RestauranteDatos = new FormData();
        RestauranteDatos.append('nombreRestaurante', this.registroForm.get('nombreRestaurante')?.value);
        RestauranteDatos.append('correoRestaurante', this.registroForm.get('correoRestaurante')?.value);
        RestauranteDatos.append('telefonoRestaurante', this.registroForm.get('telefonoRestaurante')?.value);
        RestauranteDatos.append('encargadoRestaurante', this.registroForm.get('encargadoRestaurante')?.value);
        RestauranteDatos.append('apellidoEncargado', this.registroForm.get('apellidoEncargado')?.value);
        RestauranteDatos.append('direccionRestaurante', this.registroForm.get('direccionRestaurante')?.value);
        RestauranteDatos.append('contrasena', this.registroForm.get('contrasena')?.value);
        RestauranteDatos.append('numeroPreguntaSecreta', this.registroForm.get('preguntaSecreta')?.value);
        RestauranteDatos.append('respuestaSecreta', this.registroForm.get('respuestaSecreta')?.value);
        RestauranteDatos.append('numeroRestaurante', this.segundaFaseForm.get('numeroRestaurante')?.value);
        RestauranteDatos.append('razonSocial', this.segundaFaseForm.get('razonSocial')?.value);
        RestauranteDatos.append('domicilioFiscal', this.segundaFaseForm.get('domicilioFiscal')?.value);
        RestauranteDatos.append('nombreTitular', this.terceraFaseForm.get('nombreTitular')?.value);
        RestauranteDatos.append('direccion', this.terceraFaseForm.get('direccion')?.value);
        RestauranteDatos.append('ciudad', this.terceraFaseForm.get('ciudad')?.value);
        RestauranteDatos.append('codigoPostal', this.terceraFaseForm.get('codigoPostal')?.value);
        RestauranteDatos.append('numeroCLABE', this.terceraFaseForm.get('numeroCLABE')?.value);
        RestauranteDatos.append('horaApertura', this.segundaFaseForm.get('horaApertura')?.value);
        RestauranteDatos.append('horaCierre', this.segundaFaseForm.get('horaCierre')?.value);
        RestauranteDatos.append('categoriaRestaurante', this.segundaFaseForm.get('categoriaRestaurante')?.value); // Enviar solo un valor
        
        // Agregar imágenes solo si están presentes
        RestauranteDatos.append('menuImagen', this.menuImagenFile[0]);
        RestauranteDatos.append('identificacionOficial', this.identificacionOficialFile[0]);
        RestauranteDatos.append('constanciaFiscal', this.constanciaFiscalFile[0]);
        RestauranteDatos.append('estadoCuentaBancaria', this.estadoCuentaBancariaFile[0]);
        RestauranteDatos.append('licenciaFuncionamiento', this.licenciaFuncionamientoFile[0]);
        console.log('Datos del formulario:', RestauranteDatos);
  
        this.authRestauranteService.RegistroRestaurante(RestauranteDatos).subscribe(
          (response) => {
            this.mostrarMensajeEmergente();
            this.router.navigate(['/login-restaurante']);
          },
          (error) => {
            console.error('Error en el registro:', error);
            // Manejar el error según sea necesario
          }
        );
      } else {
        console.error('El formulario no es válido');
      }
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
    }
  }
  private mostrarMensajeEmergente() {
    this.dialog.open(MensajeComponent, {
      width: '400px',
      data: { mensaje: 'RESTAURANTE CREADO EXITOSAMENTE!!!' }
    });
  }

  navegarACuartaFase() {
    // Puedes realizar validaciones adicionales aquí si es necesario
    this.cambiarFase('cuarta');
  }
  
  getErrorMessage(controlName: string): string {
    const control = this.registroForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Campo obligatorio';
    }

    if (controlName === 'telefono' && control?.hasError('pattern')) {
      return 'El número de teléfono debe tener 10 dígitos';
    }

    if (controlName === 'correo' && control?.hasError('email')) {
      return 'Correo electrónico no válido';
    }

    if (controlName === 'contrasena' && control?.hasError('pattern')) {
      return 'La contraseña debe tener entre 8 y 16 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &)';
    }

    return '';
  }
}
