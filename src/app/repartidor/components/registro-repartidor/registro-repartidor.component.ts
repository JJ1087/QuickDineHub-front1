// registro-repartidor.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroRepartidorService } from '../../services/registro-repartidor.service';
import { AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-registro-repartidor',
  templateUrl: './registro-repartidor.component.html',
  styleUrls: ['./registro-repartidor.component.css']
})

export class RegistroRepartidorComponent implements OnInit, AfterViewInit{

  public codigo: string = '';
  private map!: google.maps.Map;
  private marker!: google.maps.Marker;
  private geocoder!: google.maps.Geocoder;
  registroForm!: FormGroup;
  fase2Form!: FormGroup;
  fase4Form!: FormGroup; // Nuevo formulario para la Fase 4
  fase5Form!: FormGroup; // Nuevo formulario para la Fase 4
  fase6Form!: FormGroup;

  // Arreglos para almacenar los archivos seleccionados
  public identificacionfile: any = [];
  public licenciafile: any = [];
  public fotoPerfilFrontalfile: any = [];
  public fotoPerfilIzquierdofile: any = [];
  public fotoPerfilDerechofile: any = [];

  isCaptchaVerified: boolean = false;
  recaptchaSiteKey: string = '6Le6alYpAAAAAHIWXN8HgHQ19z60gq0e3YCSz5qY';
  mostrarModalAvisosPrivacidad: boolean = false; // Variable para mostrar/ocultar el modal
  faseActual = 1;
  private synth!: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null!;


  desplegables: { [key: string]: boolean } = {
    identificacion: false,
    licencia: false,
    fotoPerfil: false,
    claveInterbancaria: false
  };
  

  constructor(private formBuilder: FormBuilder, private router: Router, private registroService: RegistroRepartidorService,     @Inject(PLATFORM_ID) private platformId: Object,private cdr: ChangeDetectorRef,
  private fb: FormBuilder) {}
  
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
    const input = document.getElementById('ciudad') as HTMLInputElement;
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

      // Asigna el valor seleccionado al campo de ciudad
      this.registroForm.get('ciudad')?.setValue(place.formatted_address || place.name || '');
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

        // Asigna el valor geocodificado al campo de ciudad
        this.registroForm.get('ciudad')?.setValue(results[0].formatted_address);
        this.cdr.detectChanges();
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
  capturarIdentificacion(event: any) {
    const identificacioncapturado = event.target.files[0];
    this.identificacionfile.push(identificacioncapturado);
  }

  capturarLicencia(event: any) {
    const licenciacapturado = event.target.files[0];
    this.licenciafile.push(licenciacapturado);
  }

  capturarFotoPerfilFrontal(event: any) {
    const fotoPerfilFrontalcapturado = event.target.files[0];
    this.fotoPerfilFrontalfile.push(fotoPerfilFrontalcapturado);
  }

  capturarFotoPerfilIzquierdo(event: any) {
    const fotoPerfilIzquierdocapturado = event.target.files[0];
    this.fotoPerfilIzquierdofile.push(fotoPerfilIzquierdocapturado);
  }

  capturarFotoPerfilDerecho(event: any) {
    const fotoPerfilDerechocapturado = event.target.files[0];
    this.fotoPerfilDerechofile.push(fotoPerfilDerechocapturado);
  }

  generarCodigoYEnviarCorreo() {
    const email = this.registroForm.get('email')?.value;
    this.codigo = this.generateAuthenticationCode();

    // Envía el código por correo electrónico
    this.registroService.enviarCorreoAutenticacion(email, this.codigo)
      .subscribe(
        () => {
          console.log('Correo electrónico enviado exitosamente');
          // Aquí puedes realizar alguna acción adicional si es necesario
        },
        error => {
          console.error('Error al enviar el correo electrónico:', error);
        }
      );
  }

  generateAuthenticationCode(): string {
    const length = 6; // Longitud del código de autenticación
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Caracteres permitidos
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
  
    return code;
    }

  ngOnInit() {
    this.registroForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      ciudad: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/)]],
      aceptarPrivacidad: [false, Validators.requiredTrue],
      preguntaSecreta: ['', Validators.required], // Agrega la pregunta secreta al formulario
      respuestaSecreta: ['', Validators.required], // Agrega la respuesta secreta al formulario
      
    });

    this.fase2Form = this.formBuilder.group({
        marcaCarro: ['', Validators.required],
        modeloCarro: ['', Validators.required],  // Agregado para el modelo del carro
        anioCarro: ['', Validators.required],    // Agregado para el año del carro
        matriculaCarro: ['', Validators.required], // Nuevo campo para aceptar avanzar a la Fase 3
    });
    this.fase4Form = this.formBuilder.group({
      marcaMoto: ['', Validators.required],
      modeloMoto: ['', Validators.required],
      anioMoto: ['', Validators.required],
      matriculaMoto: ['', Validators.required],
    });

    this.fase5Form = this.formBuilder.group({
      identificacion: ['', Validators.required],
      licencia: ['', Validators.required],
      fotoPerfilFrontal: ['', Validators.required],
      fotoPerfilIzquierdo: ['', Validators.required],
      fotoPerfilDerecho: ['', Validators.required],
      claveInterbancaria: ['', Validators.required],
    });
    
    this.fase6Form = this.formBuilder.group({
      claveAutenticacion: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
      // Agrega más validadores según tus necesidades
    });

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
  onSiguienteClick() {
    if (this.faseActual === 1 && this.registroForm.valid && this.isCaptchaVerified) {
      this.faseActual = 2;
    } else if (this.faseActual === 2 && this.fase2Form.valid) {
      const tipoVehiculo = this.fase2Form.get('tipoVehiculo')?.value;
  
      if (tipoVehiculo === 'carro') {
        this.faseActual = 3;
      } else {
        // Agrega lógica para bicicleta y motocicleta si es necesario
      }
    } else if (this.faseActual === 3) {
      // Realiza alguna acción si es necesario para la Fase 3
    }
  }

  seleccionarTipoVehiculo(tipo: string) {
    // Actualiza el valor del formulario con el tipo seleccionado
    this.fase2Form.get('tipoVehiculo')?.setValue(tipo);

    // Si el tipo es "carro" o "motocicleta", redirige directamente a la Fase 3 o Fase 4
    if (tipo === 'carro') {
      this.faseActual = 3;
    } else if (tipo === 'motocicleta') {
      this.faseActual = 4;
    }
  }

  toggleDesplegable(seccion: string): void {
    this.desplegables[seccion] = !this.desplegables[seccion];
}



  onSubmit() {
    if (this.registroForm.valid && this.isCaptchaVerified) {
      console.log('Registro exitoso:', this.registroForm.value);
      this.generarCodigoYEnviarCorreo(); // Llama a la función para generar el código y enviar el correo electrónico
    } else {
      console.log('Por favor, complete todos los campos correctamente, el captcha y acepte el aviso de privacidad.');
    }
    if (this.registroForm.valid && this.isCaptchaVerified) {
      this.faseActual = 2;
    }
  }
  onFase2Submit() {
    if (this.fase2Form.valid) {
      // Lógica de verificación (por implementar)
      // Redirigir según sea necesario
      this.router.navigate(['/']);  // Ajusta la ruta según tus necesidades
    }
  }

onFase3Submit() {
  if (this.fase2Form.valid) {
    // Lógica para procesar la información de la Fase 3
    const marcaCarro = this.fase2Form.get('marcaCarro')?.value;
    const modeloCarro = this.fase2Form.get('modeloCarro')?.value;
    const anioCarro = this.fase2Form.get('anioCarro')?.value;
    const matriculaCarro = this.fase2Form.get('matriculaCarro')?.value;

    console.log('Información del vehículo (Fase 3):');
    console.log('Marca del Carro:', marcaCarro);
    console.log('Modelo del Carro:', modeloCarro);
    console.log('Año del Carro:', anioCarro);
    console.log('Matrícula del Carro:', matriculaCarro);

    // Redirige a la página deseada o realiza otras acciones necesarias
    this.faseActual = 5;
  }
}
onFase4Submit() {
  if (this.fase4Form.valid) {
    const marcaMoto = this.fase4Form.get('marcaMoto')?.value;
    const modeloMoto = this.fase4Form.get('modeloMoto')?.value;
    const anioMoto = this.fase4Form.get('anioMoto')?.value;
    const matriculaMoto = this.fase4Form.get('matriculaMoto')?.value;

    console.log('Información de la motocicleta (Fase 4):');
    console.log('Marca de la Moto:', marcaMoto);
    console.log('Modelo de la Moto:', modeloMoto);
    console.log('Año de la Moto:', anioMoto);
    console.log('Matrícula de la Moto:', matriculaMoto);

    this.faseActual = 5;
    
  }
}

onFase5Submit() {
  if (this.fase5Form.valid) {
    // Process the information for Fase 5
    const identificacion = this.fase5Form.get('identificacion')?.value;
    const licencia = this.fase5Form.get('licencia')?.value;
    const fotoPerfilFrontal = this.fase5Form.get('fotoPerfilFrontal')?.value;
    const fotoPerfilIzquierdo = this.fase5Form.get('fotoPerfilIzquierdo')?.value;
    const fotoPerfilDerecho = this.fase5Form.get('fotoPerfilDerecho')?.value;
    const claveInterbancaria = this.fase5Form.get('claveInterbancaria')?.value;

    console.log('Información de la Fase 5:');
    console.log('Identificación:', identificacion);
    console.log('Licencia:', licencia);
    console.log('Foto de Perfil Frontal:', fotoPerfilFrontal);
    console.log('Foto de Perfil Izquierdo:', fotoPerfilIzquierdo);
    console.log('Foto de Perfil Derecho:', fotoPerfilDerecho);
    console.log('Clave Interbancaria:', claveInterbancaria);

    // Redirect to the desired page or perform other necessary actions
      this.faseActual = 6; // Redirige automáticamente a la fase de autenticación
  }
  else {
  console.log('El formulario de la Fase 5 no es válido. Revise los campos.');
}
}

onFase6Submit() {
  const codigoIngresado = this.fase6Form.get('claveAutenticacion')?.value;
  const codigoEnviado = this.codigo;

  if (codigoIngresado === codigoEnviado) {
    // El código ingresado coincide con el código enviado
    console.log('Autenticación exitosa');
    const RepartidorDatos = new FormData();
        RepartidorDatos.append('nombreRepartidor', this.registroForm.get('nombre')?.value);
        RepartidorDatos.append('apellidoRepartidor', this.registroForm.get('apellidos')?.value);
        RepartidorDatos.append('ciudadRepartidor', this.registroForm.get('ciudad')?.value);
        RepartidorDatos.append('telefonoRepartidor', this.registroForm.get('telefono')?.value);
        RepartidorDatos.append('correoRepartidor', this.registroForm.get('email')?.value);
        RepartidorDatos.append('contrasena', this.registroForm.get('contrasena')?.value);
        RepartidorDatos.append('numeroPreguntaSecreta', this.registroForm.get('preguntaSecreta')?.value);
        RepartidorDatos.append('respuestaSecreta', this.registroForm.get('respuestaSecreta')?.value);
        RepartidorDatos.append('vehiculoMarca', this.fase2Form.get('marcaCarro')?.value);
        RepartidorDatos.append('vehiculoModelo', this.fase2Form.get('modeloCarro')?.value);
        RepartidorDatos.append('vehiculoAnio', this.fase2Form.get('anioCarro')?.value);
        RepartidorDatos.append('vehiculoMatricula', this.fase2Form.get('matriculaCarro')?.value);
        RepartidorDatos.append('marcaMoto', this.fase4Form.get('marcaMoto')?.value);
        RepartidorDatos.append('modeloMoto', this.fase4Form.get('modeloMoto')?.value);
        RepartidorDatos.append('anioMoto', this.fase4Form.get('anioMoto')?.value);
        RepartidorDatos.append('matriculaMoto', this.fase4Form.get('matriculaMoto')?.value);
        RepartidorDatos.append('claveInterbancaria', this.fase5Form.get('claveInterbancaria')?.value);

        RepartidorDatos.append('identificacionOficial', this.identificacionfile[0]);
        RepartidorDatos.append('licencia', this.licenciafile[0]);
        RepartidorDatos.append('fotoPerfilFrontal', this.fotoPerfilFrontalfile[0]);
        RepartidorDatos.append('fotoPerfilIzquierda', this.fotoPerfilIzquierdofile[0]);
        RepartidorDatos.append('fotoPerfilDerecha', this.fotoPerfilDerechofile[0]);

        this.registroService.registroRepartidor(RepartidorDatos).subscribe(
          (response) => {
          this.router.navigate(['/login-repartidores']);
            },
            (error) => {
            console.error('Error en el registro:', error);
            // Manejar el error según sea necesario
          }
        );
     
  } else {
    console.log('Código de autenticación incorrecto. Intente nuevamente.');
  }
}

  volverAFase1() {
    this.faseActual = 1;
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
  
  
  handleCaptchaChange(value: string | null) {
    this.isCaptchaVerified = value !== null;
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
