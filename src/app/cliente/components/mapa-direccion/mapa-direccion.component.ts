import { Component, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mapa-direccion',
  templateUrl: './mapa-direccion.component.html',
  styleUrls: ['./mapa-direccion.component.css']
})
export class MapaDireccionComponent implements AfterViewInit {
  private map!: google.maps.Map;
  private marker!: google.maps.Marker;
  private geocoder!: google.maps.Geocoder;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private watchId: number | undefined;
  originAddress: string = '';
  destinationAddress: string = '';
  currentLocation: google.maps.LatLng | null = null;

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
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDTeWeCxH4zCEyvVPD8_t1Rg8lUHlVGSj0&libraries=places,directions`;
    document.body.appendChild(script);
    script.onload = () => {
      this.initializeMap();
      this.initializeAutocomplete();
      this.initializeDirections();
      this.startTracking();
    };

    script.onerror = () => {
      console.error('Failed to load the Google Maps API script.');
    };
  }

  initializeMap() {
    const mapElement = document.getElementById('map') as HTMLElement;
    this.map = new google.maps.Map(mapElement, {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      visible: false,
    });

    this.geocoder = new google.maps.Geocoder();
  }

  initializeAutocomplete() {
    const originInput = document.getElementById('origin-input') as HTMLInputElement;
    const destinationInput = document.getElementById('destination-input') as HTMLInputElement;

    const originAutocomplete = new google.maps.places.Autocomplete(originInput);
    const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

    originAutocomplete.addListener('place_changed', () => {
      const place = originAutocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        window.alert('No details available for input: ' + place.name);
        return;
      }
      this.originAddress = place.formatted_address || place.name || '';
      this.cdr.detectChanges();
    });

    destinationAutocomplete.addListener('place_changed', () => {
      const place = destinationAutocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        window.alert('No details available for input: ' + place.name);
        return;
      }
      this.destinationAddress = place.formatted_address || place.name || '';
      this.cdr.detectChanges();
    });
  }

  initializeDirections() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);
    this.directionsRenderer.setPanel(document.getElementById('directions-panel'));
  }

  calculateRoute() {
    if (!this.currentLocation) {
      window.alert('Current location is not available.');
      return;
    }

    const origin = new google.maps.LatLng(this.currentLocation.lat(), this.currentLocation.lng());
    const destination = this.destinationAddress;

    if (!destination) {
      window.alert('Please enter a destination address.');
      return;
    }

    const request: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        this.directionsRenderer.setDirections(result);

        // Center the map to the start location
        if (result.routes.length > 0) {
          const route = result.routes[0];
          if (route.overview_path.length > 0) {
            this.map.setCenter(route.overview_path[0]);
            this.map.setZoom(14);
          }
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  startTracking() {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.map.setCenter(this.currentLocation);
          this.marker.setPosition(this.currentLocation);
          this.marker.setVisible(true);
          this.calculateRoute(); // Recalculate the route with the updated position
        },
        (error) => {
          console.error('Error getting current location:', error);
          window.alert('Error getting current location.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      window.alert('Geolocation is not supported by this browser.');
    }
  }
}
