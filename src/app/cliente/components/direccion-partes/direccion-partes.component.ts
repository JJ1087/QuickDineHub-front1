// direccion-partes.component.ts
import { Component, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-direccion-partes',
  templateUrl: './direccion-partes.component.html',
  styleUrls: ['./direccion-partes.component.css']
})
export class DireccionPartesComponent implements AfterViewInit {
  direccionControl = new FormControl('');
  direccionCompleta: string = '';
  colonia: string = '';
  calles: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

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
      this.initializeAutocomplete();
    };

    script.onerror = () => {
      console.error('Failed to load the Google Maps API script.');
    };
  }

  initializeAutocomplete() {
    const input = document.getElementById('direccionCompleta') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['address'],
      componentRestrictions: { country: 'MX' }
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.address_components) {
        this.extractAddressParts(place.address_components);
      }
    });
  }

  extractAddressParts(addressComponents: google.maps.GeocoderAddressComponent[]) {
    const coloniaComponent = addressComponents.find(ac => ac.types.includes('sublocality_level_1')) || 
                             addressComponents.find(ac => ac.types.includes('neighborhood'));
    const routeComponent = addressComponents.find(ac => ac.types.includes('route'));

    this.colonia = coloniaComponent ? coloniaComponent.long_name : '';
    this.calles = routeComponent ? routeComponent.long_name : '';

    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  onDireccionChange(value: string) {
    this.direccionCompleta = value;
    // Optionally, clear colonia and calles when address changes
    this.colonia = '';
    this.calles = '';
  }
}
