import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerlistComponent } from './layerlist.component';

describe('LayerlistComponent', () => {
  let component: LayerlistComponent;
  let fixture: ComponentFixture<LayerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayerlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
