import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
// declare var esriConfig: any;
import { environment } from 'src/environment/environment';
import Map from '@arcgis/core/Map.js';
import Mapview from '@arcgis/core/views/MapView.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import LabelClass from '@arcgis/core/layers/support/LabelClass.js';
import config from '@arcgis/core/config';
import TopFeaturesQuery from '@arcgis/core/rest/support/TopFeaturesQuery.js';
import TopFilter from '@arcgis/core/rest/support/TopFilter.js';
import { ArcgisService } from '../arcgis.service';
@Component({
  selector: 'app-layerlist',
  templateUrl: './layerlist.component.html',
  styleUrls: ['./layerlist.component.css'],
})
export class LayerlistComponent implements AfterViewInit, OnInit {
  jsonData: any;

  map!: Map;
  view: any;
  layerName!: string;
  url!: string;
  icon!: string;
  query: any;
  arr = [];
  @ViewChild('map', { static: true }) mapEl!: ElementRef;
  @ViewChild('exportButton', { static: true }) excel!: ElementRef;
  convertExcel: any;
  layer: any;
  constructor(private arcgisServices: ArcgisService) {}
  async loadLayer(form: any) {
    this.layerName = form.value.layerName;
    // this.layerName = 'atm';
    this.url = form.value.url;
    // this.url =
    //   'https://services3.arcgis.com/BwZSbW2kx9yDHDBi/arcgis/rest/services/Mangalore_Feb6/FeatureServer/1';
    this.icon = form.value.icon;
    console.log(
      `Layer Name: ${this.layerName}, URL: ${this.url}, Icon: ${this.icon}`
    );
    this.createFeatureLayer(this.layerName, this.url, this.icon);
  }

  downloadJson(data: any, dataname: any) {
    // Convert the data to a JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${dataname}.json`;

    // Append the link to the document
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  }
  getFeatureLayer() {
    this.convertExcel = this.excel.nativeElement;
    let URL = this.url;
    this.convertExcel.addEventListener('click', async () => {
      console.log('hello');

      const featureLayer = this.arcgisServices.loadFeatureLayer(URL);
      console.log('hi');
      console.log(featureLayer, 'hi');
      const data = await featureLayer;
      this.queryLayer(data, 'name');
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
    console.log(data);
    const res = JSON.stringify(data);
    console.log(res);
    const jsonData = JSON.parse(res);
    console.log(typeof jsonData);
    this.downloadJson(jsonData, this.layerName);

    console.log('Working Query Layer', { name });
  }

  ngAfterViewInit(): void {
    // const convertExcel = this.excel.nativeElement;
    // convertExcel.onclick = async function () {
    // const featureLayer = await this.arcgisServices.loadFeatureLayer(this.url);
    // console.log('hi');
    // console.log(featureLayer, 'hi');
    // };
    this.getFeatureLayer();
    this.initializeMap().then(() => {
      console.log('Map is working fine');
    });
  }
  initializeMap(): any {
    const container = this.mapEl.nativeElement;
    this.map = new Map({
      basemap: 'arcgis/navigation',
    });
    const view = new Mapview({
      map: this.map,
      container,
      center: [74.89645756441325, 12.927177071929599],
      zoom: 9,
    });
    this.view = view;
    return this.view.when();
  }
  ngOnInit(): void {
    // config.assetsPath = 'assets/';
    config.apiKey = environment.esriApiKey;
    console.log('hi');
  }
  _layer: any;
  createFeatureLayer(
    // symbolType: any,
    titleName: any,
    url: any,
    symbolIcon: any
  ) {
    let symbol: any = {
      type: 'simple',
      symbol: {
        type: 'web-style',
        name: symbolIcon,
        styleName: 'Esri2DPointSymbolsStyle',
      },
    };
    this.map.remove(this._layer);
    this._layer = new FeatureLayer({
      url: url,
      screenSizePerspectiveEnabled: true,
      renderer: symbol,
      labelingInfo: [
        new LabelClass({
          symbol: {
            type: 'text',
            color: 'white',
            haloColor: 'black',
            haloSize: '2px',
            font: {
              family: 'Arial',
              size: 10,
              weight: 'bold',
            },
          },
          labelExpressionInfo: {
            expression: '$feature.name',
          },
          labelPlacement: 'above-center',
          repeatLabel: true,
        }),
      ],
      title: titleName,

      refreshInterval: 0.1,
      popupTemplate: {
        title: titleName,
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'name',
                label: 'NAME',
              },
              {
                fieldName: 'address',
                label: 'ADDRESS',
              },
            ],
          },
        ],
      },
    });
    this.map.add(this._layer);
    this.queryLayer(this._layer, 'name');
  }
}
