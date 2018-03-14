import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RideDialogComponent } from './ride-dialog.component';

describe('RideDialogComponent', () => {
  let component: RideDialogComponent;
  let fixture: ComponentFixture<RideDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RideDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
