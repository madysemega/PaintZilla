import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { MagnetismComponent } from './magnetism.component';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-file-line-count
// tslint:disable:no-unused-expression
// tslint:disable:prefer-const
describe('MagnetismComponent', () => {
    let component: MagnetismComponent;
    let fixture: ComponentFixture<MagnetismComponent>;
    let rectangleSelectionCreator: RectangleSelectionCreatorService;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let gridCtxStub: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let canvasSizeStub: Vec2;
    beforeEach(async(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [MatMenuModule, CommonModule, MatTooltipModule, HotkeyModule.forRoot()],
            declarations: [MagnetismComponent],
            providers: [
                { provide: HotkeysService, useValue: hotkeysServiceStub },
                { provide: DrawingService, useValue: drawServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MagnetismComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        component.toolSelector = TestBed.inject(ToolSelectorService);
        rectangleSelectionCreator = TestBed.inject(RectangleSelectionCreatorService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        gridCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas = canvasTestHelper.canvas;
        component.drawingService.gridCtx = gridCtxStub;
        component.drawingService.canvas = canvas;
        component.drawingService.canvasSize = canvasSizeStub;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('notifying the manipulators should change the isMagnetismActivated property in the selection Manipulator ', () => {
        component.isActivated = true;
        component.notifyManipulators();
        expect(rectangleSelectionCreator.selectionManipulator.isMagnetismActivated).toEqual(true);
    });
    it('toogle the grid should draw ', () => {
        component.isGridActivated = true;
        component.toggleGrid();
        expect(component.drawGrid()).toHaveBeenCalled();
    });
    it('toogle the grid with no activate should not draw ', () => {
        component.isGridActivated = false;
        component.toggleGrid();
        expect(component.deleteGrid()).toHaveBeenCalled();
    });
    it('delete grid should remove grid ', () => {
        component.deleteGrid();
        expect(component.drawingService.gridCtx.stroke()).toHaveBeenCalled();
    });
    it('drawGrid should draw', () => {
        component.drawingService.canvasSize.x = 100;
        component.drawingService.canvasSize.y = 100;
        component.drawGrid();
        expect(component.drawingService.gridCtx.stroke()).toHaveBeenCalled();
    });
    it('change opacity should change opacity', () => {
        component.opaciteChange(10);
        component.isGridActivated = true;
        expect(component.opacite).toEqual(10);
        expect(component.drawingService.gridCtx.stroke()).toHaveBeenCalled();
    });
    it('change opacity should change opacity', () => {
        component.gridCellSizeChange(10);
        component.isGridActivated = true;
        expect(component.gridCellSize).toEqual(10);
        expect(component.drawingService.gridCtx.stroke()).toHaveBeenCalled();
    });

    it('setting grid anchor should change the grid movement anchor in the selection Manipulator', () => {
        const dummyAnchor = 5;
        component.setGridAnchor(dummyAnchor);
        expect(rectangleSelectionCreator.selectionManipulator.gridMovementAnchor).toEqual(dummyAnchor);
    });
});
