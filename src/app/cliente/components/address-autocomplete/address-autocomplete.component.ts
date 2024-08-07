/// <reference types="@types/google.maps" />

import { Component, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-address-autocomplete',
  templateUrl: './address-autocomplete.component.html',
  styleUrls: ['./address-autocomplete.component.css']
})
export class AddressAutocompleteComponent implements AfterViewInit {
  private map!: google.maps.Map;
  private marker!: google.maps.Marker;
  private geocoder!: google.maps.Geocoder;
  selectedAddress: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef  // Inyectar ChangeDetectorRef
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
      center: { lat: -33.8688, lng: 151.2195 }, // Coordenadas de Sídney, puedes cambiarlas
      zoom: 13,
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      visible: false,
    });

    this.geocoder = new google.maps.Geocoder();

    // Añadir un evento de clic al mapa
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.geocodeLatLng(event.latLng);
      }
    });
  }

  initializeAutocomplete() {
    const input = document.getElementById('autocomplete-input') as HTMLInputElement;
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

      // Asignar una cadena vacía si `formatted_address` y `name` son `undefined`
      this.selectedAddress = place.formatted_address || place.name || '';
      this.cdr.detectChanges(); // Forzar la detección de cambios
    });
  }

  geocodeLatLng(latLng: google.maps.LatLng | google.maps.LatLngLiteral) {
    this.geocoder.geocode({ location: latLng }, (results, status: google.maps.GeocoderStatus) => {
      if (status === "OK" && results) {
        this.map.setCenter(latLng);
        this.map.setZoom(17);

        this.marker.setPosition(latLng);
        this.marker.setVisible(true);

        // Asignar una cadena vacía si `formatted_address` es `undefined`
        this.selectedAddress = results[0].formatted_address || '';
        this.cdr.detectChanges(); // Forzar la detección de cambios
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }
}
