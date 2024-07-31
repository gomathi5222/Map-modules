import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackMapComponent } from './feedback-map/feedback-map.component';
import { HttpClientModule } from '@angular/common/http';
import { LayerlistComponent } from './layerlist/layerlist.component';
import { MapComponent } from './map/map.component';
import { CurrentLocationComponent } from './current-location/current-location.component';
import { AddFeaturesAdminComponent } from './add-features-admin/add-features-admin.component';
const routes: Routes = [
  { path: 'feedback', component: FeedbackMapComponent },
  { path: '', component: LayerlistComponent },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'cl',
    component: CurrentLocationComponent,
  },
  {
    path: 'addfeature',
    component: AddFeaturesAdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, HttpClientModule],
})
export class AppRoutingModule {}
