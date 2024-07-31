import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import config from '@arcgis/core/config';
import Map from '@arcgis/core/Map.js';
import Mapview from '@arcgis/core/views/MapView.js';
import { environment } from 'src/environment/environment';
import * as services from 'src/assets/addFeatures.json';
import Graphic from '@arcgis/core/Graphic.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import LabelClass from '@arcgis/core/layers/support/LabelClass';

@Component({
  selector: 'app-add-features-admin',
  templateUrl: './add-features-admin.component.html',
  styleUrls: ['./add-features-admin.component.css'],
})
export class AddFeaturesAdminComponent implements AfterViewInit {
  services: any = services;
  geometry: any = {
    type: 'point',
  };
  ngAfterViewInit(): void {
    this.initializeMap().then(() => {
      console.log('Map is working fine');
    });
    this.data();
  }
  map!: Map;
  view: any;
  atm: any;
  graphics: any[] = [];
  graphic: any;

  constructor() {}

  renderer: any = {
    type: 'simple', // autocasts as new SimpleRenderer()
    symbol: {
      type: 'webstyle',
      name: '',
      styleName: 'Esri2DPointSymbolsStyle',
    },
    refreshInterval: 0.1,
  };
  @ViewChild('map', { static: true }) mapEl!: ElementRef;
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
    config.apiKey = environment.esriApiKey;
    // console.log('hi');
    // console.log(this.services.services);
  }
  ChooseLayer(obj: any) {
    console.log(obj);
    this.atm = new FeatureLayer({
      url: obj.url,
      renderer: {
        ...this.renderer,
        symbol: {
          type: obj.symbolType,
          name: obj.symbolIcon,
          styleName: 'Esri2DPointSymbolsStyle',
        },
      },
      popupTemplate: {
        title: `${obj.categoryName} in Mangaluru`,
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
      title: obj.categoryName,
      labelingInfo: [
        new LabelClass({
          // autocasts as new LabelClass()
          symbol: {
            type: 'text',
            color: 'white',
            haloColor: 'black',
            haloSize: '2px',
            font: {
              // autocast as new Font()
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
          // repeatDistanceLabel: 100,
        }),
      ],
    });

    // atm.popupTemplate = popupTemplate;
    this.map.add(this.atm);
    const options = {
      // globalIdUsed has to be true when adding, updating or deleting attachments
      globalIdUsed: true,
      rollbackOnFailureEnabled: true,
    };

    const deleteFeature = [
      { globalId: 'D9F5F959-B103-4B37-89D7-EBFA9E1A5F81' },
    ];

    const addEdits = {
      addFeatures: this.graphics,
      deleteFeatures: deleteFeature,
    };
    this.atm.applyEdits(addEdits, options).then(function (results: any) {
      console.log('edits added: ', results);
      results.addFeatureResults.map((e: any) => {
        console.log(e);
      });
    });
  }

  data = () => {
    fetch(
      'https://msclgis.karnatakasmartcity.in/api/mangaluruBuilding/approved'
    ).then(async (res: any) => {
      const serve = this.services.services;
      const res1 = await res.json();
      const Data = res1.data;

      // console.log(Data);
      // Data.map((e: any) => console.log(e.categoryValue));
      let obj = Data.find((o: any) => serve.categoryName === o.categoryValue);
      if (!obj) return;
      console.log(obj);

      Data.forEach((e: any) => {
        for (obj of serve) {
          if (obj.categoryName === e.categoryValue) {
            this.ChooseLayer(obj);
            this.graphic = new Graphic({
              geometry: {
                ...this.geometry,
                // latitude: e.latitude,
                // longitude: e.longitude,
                latitude: 12.938965658872563,
                longitude: 74.95598382908068,
              },
              attributes: {
                name: e.buildingName,
                address: e.address,
              },
            });
            this.graphics.push(this.graphic);
            console.log(this.atm.visible);
            if (this.atm.visible === true) {
              this.deleteEntries(e);
            } else {
              return;
            }
          }
        }
      });
    });
    // return this.graphics;
  };
  async deleteEntries(entry: any) {
    try {
      const body = {
        latitude: entry.latitude,
        longitude: entry.longitude,
        buildingName: entry.buildingName,
        description: entry.description,
      };
      const headers = {
        'Content-Type': 'application/json;charset=utf-8',
      };
      const response = fetch(
        'https://msclgis.karnatakasmartcity.in/api/mangaluruBuilding/updateapproved/' +
          entry.id,
        {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
      const res = await response;
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
}
