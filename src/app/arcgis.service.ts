import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';

@Injectable({
  providedIn: 'root',
})
export class ArcgisService {
  static loadFeatureLayer(url: any) {
    throw new Error('Method not implemented.');
  }
  constructor() {}
  async loadFeatureLayer(url: string) {
    const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer']);
    return new FeatureLayer({
      url: url,
    });
  }
}
