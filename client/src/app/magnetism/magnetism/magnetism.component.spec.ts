import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
import { MagnetismComponent } from './magnetism.component';


// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-file-line-count
// tslint:disable:no-unused-expression
describe('MagnetismComponent', () => {
    let component: MagnetismComponent;
    let fixture: ComponentFixture<MagnetismComponent>;
    let rectangleSelectionCreator: RectangleSelectionCreatorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatMenuModule],
            declarations: [MagnetismComponent],
        }).compileComponents();
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
        component.isGridActivated = false;
        component.toggleGrid();
        component.toggleGrid();
        expect(component.isGridActivated).toEqual(false);
    });
    it('draw grid should call stroke', () => {
        component.drawGrid()
        expect(component.drawingService.gridCtx.stroke()).toHaveBeenCalled();
    });
    it('no activate grid should not call', () => {
        component.isGridActivated = false;
        component.toggleGrid();
        expect(component.drawGrid()).toHaveBeenCalled();
    });
    it('activate grid should draw', () => {
        component.isGridActivated = true;
        component.toggleGrid();
        expect(component.drawGrid()).toHaveBeenCalled();
    });

    it('toggling magnetism twice should not change initial value', () => {
        const dummyAnchor = 5;
        component.setGridAnchor(dummyAnchor);
        expect(rectangleSelectionCreator.selectionManipulator.gridMovementAnchor).toEqual(dummyAnchor);
    });
});
