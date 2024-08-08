import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { ArcgisService } from '../arcgis.service';
import { loadModules } from 'esri-loader';
import TopFeaturesQuery from '@arcgis/core/rest/support/TopFeaturesQuery.js';
import TopFilter from '@arcgis/core/rest/support/TopFilter.js';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  private view: any;
  private map: any;
  url!: string;
  query: any;
  layerName!: string;

  constructor(private arcgisService: ArcgisService) {}

  @ViewChild('exportButton', { static: true }) excel!: ElementRef;
  convertExcel: any;
  async ngOnInit() {
    // const [Map, MapView] = await loadModules([
    //   'esri/Map',
    //   'esri/views/MapView',
    // ]);
    // this.map = new Map({
    //   basemap: 'streets-vector',
    // });
    // this.view = new MapView({
    //   container: 'viewDiv',
    //   map: this.map,
    //   center: [74.856, 12.914], // longitude, latitude
    //   zoom: 12,
    // });
  }
  inputText = document.getElementById('url');
  async ngAfterViewInit() {
    this.getLocation();
    this.calculateTime('00.00', '23.59');
    const featureLayer = await this.arcgisService.loadFeatureLayer(
      'https://services3.arcgis.com/BwZSbW2kx9yDHDBi/arcgis/rest/services/Mangalore_Feb6/FeatureServer/1'
    );

    // this.map.add(featureLayer);

    this.convertExcel = this.excel.nativeElement;

    this.convertExcel.addEventListener('click', async () => {
      const link = document.getElementById('url');
      console.log(link);
      this.queryLayer(featureLayer, 'name');
    });
  }
  async queryLayer(
    featureLayer: { queryTopFeatures: (arg0: any) => any },
    name: any
  ) {
    this.query = new TopFeaturesQuery({
      topFilter: new TopFilter({
        topCount: 1,
        groupByFields: [`${name}`],
        orderByFields: [`${name} DESC`],
      }),
      outFields: ['*'],
      returnGeometry: true,
      cacheHint: false,
    });
    const results = await featureLayer.queryTopFeatures(this.query);
    const data = await results;
    // console.log(data);
    const res = JSON.stringify(data);
    // console.log(res);
    const jsonData = JSON.parse(res);
    // console.log(typeof jsonData);
    this.downloadJson(jsonData, this.layerName);
    console.log('Working Query Layer', { name });
  }

  downloadJson(data: any, dataname: any) {
    // Convert the data to a JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    // console.log(jsonString);
    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${dataname}.geojson`;

    // Append the link to the document
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  }
  ngOnDestroy() {
    if (this.view) {
      this.view.destroy();
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos: any) {
        console.log(pos.coords);
      });
    }
  }

  calculateTime(time1: any, time2: any) {
    let [hours1, minutes1] = time1.split('.').map(Number);
    let [hours2, minutes2] = time2.split('.').map(Number);

    let date1: any = new Date(0, 0, 0, hours1, minutes1);
    let date2: any = new Date(0, 0, 0, hours2, minutes2);

    // Calculate the difference in milliseconds
    let diffInMs = date1 - date2;

    // Convert the difference to minutes
    let diffInMinutes = Math.floor(diffInMs / 1000 / 60);

    let diffHours = Math.floor(diffInMinutes / 60);
    let diffMinutes = diffInMinutes % 60;

    console.log(`${diffHours} hours and ${diffMinutes} minutes`);
  }
}
