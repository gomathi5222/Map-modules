import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';
@Injectable({
  providedIn: 'root',
})
export class EsriServiceService {
  constructor() {}
  loadEsriModules() {
    return loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/Basemap',
      'esri/config',
      'esri/layers/support/LabelClass',
      'esri/layers/VectorTileLayer',
      'esri/layers/FeatureLayer',
      'esri/Graphic',
      'esri/widgets/Legend',
    ]);
  }
}
