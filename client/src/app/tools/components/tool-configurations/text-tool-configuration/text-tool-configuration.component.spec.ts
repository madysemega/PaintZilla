import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextToolConfigurationComponent } from './text-tool-configuration.component';

describe('TextToolConfigurationComponent', () => {
  let component: TextToolConfigurationComponent;
  let fixture: ComponentFixture<TextToolConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextToolConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextToolConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
