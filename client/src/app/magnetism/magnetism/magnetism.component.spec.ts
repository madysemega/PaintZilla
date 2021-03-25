import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';

import { MagnetismComponent } from './magnetism.component';

describe('MagnetismComponent', () => {
  let component: MagnetismComponent;
  let fixture: ComponentFixture<MagnetismComponent>;
  let rectangleSelectionCreator: RectangleSelectionCreatorService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [MagnetismComponent]
    })
      .compileComponents();

      
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagnetismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.toolSelector = TestBed.inject(ToolSelectorService);
    rectangleSelectionCreator = TestBed.inject(RectangleSelectionCreatorService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggling magnetism twice should not change initial value', () => {
    component.isActivated = false;
    component.toggleMagnetism();
    component.toggleMagnetism();
    expect(component.isActivated).toEqual(false);
  });

  it('toggling magnetism twice should not change initial value', () => {
    component.setGridAnchor(5);
    expect(rectangleSelectionCreator.selectionManipulator.gridMovementAnchor).toEqual(5);
  });

});
