import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeaturesAdminComponent } from './add-features-admin.component';

describe('AddFeaturesAdminComponent', () => {
  let component: AddFeaturesAdminComponent;
  let fixture: ComponentFixture<AddFeaturesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFeaturesAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFeaturesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
