import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteProfileDialogComponent } from './note-profile-dialog.component';

describe('NoteProfileDialogComponent', () => {
  let component: NoteProfileDialogComponent;
  let fixture: ComponentFixture<NoteProfileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteProfileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
