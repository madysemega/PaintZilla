import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
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
    let ctxStub: HTMLCanvasElement;
    let canvasTestHelper: CanvasTestHelper;
    //let drawingStub: DrawingService;
    //let historyServiceStub: jasmine.SpyObj<HistoryService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatMenuModule],
            declarations: [MagnetismComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MagnetismComponent);
        component = fixture.componentInstance;
        canvasTestHelper = new CanvasTestHelper();
        fixture.detectChanges();
        component.toolSelector = TestBed.inject(ToolSelectorService);
        rectangleSelectionCreator = TestBed.inject(RectangleSelectionCreatorService);
        ctxStub = canvasTestHelper.canvas;
        //drawingStub = new DrawingService(historyServiceStub);
        
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
    it('toggling grid twice should not change initial value', () => {
        component.isGridActivated = false;
        component.drawingService.canvas = ctxStub;
        component.toggleGrid();
        component.toggleGrid();
        expect(component.isGridActivated).toEqual(false);
    });

    it('toggling magnetism twice should not change initial value', () => {
        const dummyAnchor = 5;
        component.setGridAnchor(dummyAnchor);
        expect(rectangleSelectionCreator.selectionManipulator.gridMovementAnchor).toEqual(dummyAnchor);
    });
});
