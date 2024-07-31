import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackMapComponent } from './feedback-map.component';

describe('FeedbackMapComponent', () => {
  let component: FeedbackMapComponent;
  let fixture: ComponentFixture<FeedbackMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
