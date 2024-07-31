import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <--- Add this

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedbackMapComponent } from './feedback-map/feedback-map.component';
import { LayerlistComponent } from './layerlist/layerlist.component';
import { MapComponent } from './map/map.component';
import { ArcgisService } from './arcgis.service';
import { CurrentLocationComponent } from './current-location/current-location.component';
import { AddFeaturesAdminComponent } from './add-features-admin/add-features-admin.component';
import { EsriServiceService } from './esri--service.service';

@NgModule({
  declarations: [
    AppComponent,
    FeedbackMapComponent,
    LayerlistComponent,
    MapComponent,
    CurrentLocationComponent,
    AddFeaturesAdminComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [ArcgisService, EsriServiceService],
  bootstrap: [AppComponent],
})
export class AppModule {}
