import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgurLinkDialogComponent } from './imgur-link-dialog.component';

describe('ImgurLinkDialogComponent', () => {
  let component: ImgurLinkDialogComponent;
  let fixture: ComponentFixture<ImgurLinkDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgurLinkDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgurLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
