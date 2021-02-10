import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineToolConfigurationComponent } from './line-tool-configuration.component';

describe('LineToolConfigurationComponent', () => {
  let component: LineToolConfigurationComponent;
  let fixture: ComponentFixture<LineToolConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineToolConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineToolConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
