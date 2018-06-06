import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRidesComponent } from './detail-rides.component';

describe('DetailRidesComponent', () => {
  let component: DetailRidesComponent;
  let fixture: ComponentFixture<DetailRidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRidesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
