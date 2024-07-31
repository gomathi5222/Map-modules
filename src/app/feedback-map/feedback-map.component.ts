import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import Map from '@arcgis/core/Map.js';
import Mapview from '@arcgis/core/views/MapView.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import LabelClass from '@arcgis/core/layers/support/LabelClass.js';
import * as json from 'src/assets/services.json';

@Component({
  selector: 'app-feedback-map',
  templateUrl: './feedback-map.component.html',
  styleUrls: ['./feedback-map.component.css'],
})
export class FeedbackMapComponent implements OnInit, OnDestroy {
  view: any;
  res: any = [];
  result: any = json;
  layer: any;
  div = document.getElementById('div1');
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    const data = this.result.services;
    // ஃconsole.log('Data', data);
    const sel = document.getElementById('my_select') as HTMLElement;
    this.initializeMap().then(() => {
      console.log('Map is working fine');
    });
    console.log(data.length);
    for (let i = 0; i < data.length; i++) {
      this.res.push(data[i]);
      var opt = document.createElement('option');
      opt.innerHTML = data[i]['titleName'];
      opt.value = data[i]['titleName'];
      sel.appendChild(opt);
    }
  }
  @ViewChild('mapViewNode', { static: true }) el!: ElementRef;

  initializeMap(): any {
    const container = this.el.nativeElement;
    const map = new Map({
      basemap: 'hybrid',
    });
    const view = new Mapview({
      map,
      container,
      center: [74.89645756441325, 12.927177071929599],
      zoom: 13,
    });
    // console.log(this.res);
    const sel = document.getElementById('my_select') as any;

    sel.addEventListener('change', async (event: any) => {
      map.remove(this.layer);
      let obj = this.res.find((o: any) => o.titleName === event.target.value);
      console.log(obj);
      let symbol: any = {
        type: 'simple',
        symbol: {
          type: obj.symbolType,
          name: obj.symbolIcon,
          styleName: 'Esri2DPointSymbolsStyle',
        },
      };
      this.layer = new FeatureLayer({
        url: obj.url,
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
        title: obj.titleName,

        refreshInterval: 0.1,
        popupTemplate: {
          title: obj.titleName,
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
      map.add(this.layer);
      this.layer
        .when(() => {
          return this.layer.queryExtent();
        })
        .then((response: { extent: any }) => {
          view.goTo(response.extent);
        });
    });
    this.view = view;
    return this.view.when();
  }
}
