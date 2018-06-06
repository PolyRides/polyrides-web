import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRequestsComponent } from './detail-requests.component';

describe('DetailRequestsComponent', () => {
  let component: DetailRequestsComponent;
  let fixture: ComponentFixture<DetailRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
