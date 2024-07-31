import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-current-location',
  templateUrl: './current-location.component.html',
  styleUrls: ['./current-location.component.css'],
})
export class CurrentLocationComponent implements AfterViewInit {
  map: any;

  public ngAfterViewInit(): void {
    this.loadMap();
    this.getLocation();
  }
  private loadMap(): void {
    this.map = L.map('map').setView([0, 0], 1);
    L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this.map);
  }
  getLocation() {
    const icon = L.icon({
      iconUrl:
        'https://res.cloudinary.com/rodrigokamada/image/upload/v1637581626/Blog/angular-leaflet/marker-icon.png',
      shadowUrl:
        'https://res.cloudinary.com/rodrigokamada/image/upload/v1637581626/Blog/angular-leaflet/marker-shadow.png',
      popupAnchor: [13, 0],
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos: any) => {
        console.log(pos.coords);
        const marker = L.marker([pos.coords.latitude, pos.coords.longitude], {
          icon,
        }).bindPopup('Angular Leaflet');
        marker.addTo(this.map);
        this.map.flyTo([pos.coords.latitude, pos.coords.longitude], 13);
      });
    }
  }
}
