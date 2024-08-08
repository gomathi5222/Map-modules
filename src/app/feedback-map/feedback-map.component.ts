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
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils.js';

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
  id: any;
  updateFeature: any;

  options: any = {
    globalIdUsed: true,
    rollbackOnFailureEnabled: true,
  };
  div = document.getElementById('div1');
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  avg: any;
  ratingCalculation(oldRating: any, count: any, newRating: any): any {
    let avg1 = oldRating * count + newRating;
    let avg2 = count + 1;
    return avg1 / avg2;
  }
  ngOnInit(): void {
    const data = this.result.services;
    // console.log('Data', data);
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
    reactiveUtils.watch(
      () => this.view.popup.visible,
      () => {
        // this.view.closePopup();
        console.log('hi');
        // console.log(this.view.popup?.selectedFeature?.geometry);
        this.view.popup?.features.map((e: any) => {
          console.log(e.attributes);
          const ll = document.getElementById('demo') as HTMLElement;
          let ID = this.id;
          console.log(ID);
          ll.innerText = '';
          for (let key in e.attributes) {
            if (e.attributes.hasOwnProperty(key)) {
              ll.innerText += `${key}: ${e.attributes[key]} \n`;
            }
          }
          if (ID === 'FID') {
            this.updateFeature = {
              attributes: {
                FID: e.attributes.FID,
                ratings: this.ratingCalculation(
                  e.attributes.ratings,
                  e.attributes.count,
                  4
                ),
                count: e.attributes.count + 1,
              },
            };
          } else if (ID === 'OBJECTID') {
            this.updateFeature = {
              attributes: {
                OBJECTID: e.attributes.OBJECTID,
                ratings: this.ratingCalculation(
                  e.attributes.ratings,
                  e.attributes.count,
                  4
                ),
                count: e.attributes.count + 1,
              },
            };
          }

          this.layer
            .applyEdits({
              updateFeatures: [this.updateFeature],
            })
            .then((editsResult: any) => {
              console.log('Edits applied:', editsResult);
              editsResult.updateFeatureResults.map((e: any) => {
                console.log(e);
              });
            })
            .catch((error: any) => {
              console.error('Error applying edits:', error);
            }, this.options);
        });
      },

      {
        sync: true,
      }
    );
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
      // || this.res[0].titleName;
      console.log(obj);
      let symbol: any = {
        type: 'simple',
        symbol: {
          type: obj.symbolType,
          name: obj.symbolIcon,
          styleName: 'Esri2DPointSymbolsStyle',
        },
      };
      this.id = obj.id;
      console.log(this.id);
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
        outFields: ['*'],
        refreshInterval: 0.1,
        popupTemplate: {
          title: obj.titleName,
          content: [
            {
              type: 'fields',
              fieldInfos: [
                {
                  fieldName: 'ratings',
                  label: 'Ratings',
                },
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
