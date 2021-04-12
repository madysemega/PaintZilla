import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CanvasTestHelper } from '@app/app/classes/canvas-test-helper';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { BehaviorSubject } from 'rxjs';
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
    let canvasPosition: Vec2;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let historyServiceStub: HistoryService;
    beforeEach(async(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        historyServiceStub = new HistoryService(keyboardServiceStub);

        TestBed.configureTestingModule({
            imports: [MatMenuModule, CommonModule, MatTooltipModule, HotkeyModule.forRoot()],
            declarations: [MagnetismComponent],
            providers: [
                { provide: HotkeysService, useValue: hotkeysServiceStub },
                { provide: HistoryService, useValue: historyServiceStub },
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
        canvasPosition = { x: 50, y: 40 };
        canvasSizeStub = { x: 50, y: 40 };
        spyOn(canvas, 'getBoundingClientRect').and.callFake(
            jasmine
                .createSpy('getBoundingClientRect')
                .and.returnValue({ top: 1, height: 100, left: 2, width: 200, right: 202, x: canvasPosition.x, y: canvasPosition.y }),
        );
        component['drawingService'].canvasSize = canvasSizeStub;
        component['drawingService'].gridCtx = gridCtxStub; // Jasmine doesnt copy properties with underlying data
        component['drawingService'].canvas = canvas;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('notifying the manipulators should change the isMagnetismActivated property in the selection Manipulator ', () => {
        component.isActivated = true;
        component.notifyManipulators();
        expect(rectangleSelectionCreator.selectionManipulator.isMagnetismActivated).toEqual(true);
    });
    it('notifying the grid should change the isGridActivated (true)', () => {
        let isTester: BehaviorSubject<boolean> = new BehaviorSubject(true);
        let isTester2: BehaviorSubject<boolean> = new BehaviorSubject(false);
        component.isGridActivated=true;
        component.magnetismService.isGrid=isTester;
        component.magnetismService.isGrid=isTester2;
        expect(component.isGridActivated).toEqual(false);
    });
    it('toogle the grid should draw ', () => {
        component.isGridActivated = true;
        component.toggleGrid();
        expect(component.draw).toEqual(true);
    });
    it('toogle the grid with no activate should not draw ', () => {
        component.isGridActivated = false;
        component.toggleGrid();
        expect(component.deleate).toEqual(true);
    });
    it('delete grid should remove grid ', () => {
        component.deleteGrid();
        expect(component.deleate).toEqual(true);
    });
    it('drawGrid should draw', () => {
        component.drawingService.canvasSize.x = 100;
        component.drawingService.canvasSize.y = 100;
        component.drawGrid();
        expect(component.draw).toEqual(true);
    });
    it('change opacity should change opacity', () => {
        component.isGridActivated = true;
        component.opaciteChange(10);
        expect(component.opacite).toEqual(10);
        expect(component.draw).toEqual(true);
        expect(component.deleate).toEqual(true);
    });
    it('change grid cell size should change size', () => {
        component.isGridActivated = true;
        component.gridCellSizeChange(10);
        expect(component.gridCellSize).toEqual(10);
        expect(component.draw).toEqual(true);
        expect(component.deleate).toEqual(true);
    });

    it('setting grid anchor should change the grid movement anchor in the selection Manipulator', () => {
        const dummyAnchor = 5;
        component.setGridAnchor(dummyAnchor);
        expect(rectangleSelectionCreator.selectionManipulator.gridMovementAnchor).toEqual(dummyAnchor);
    });
});
