import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ExportDrawingService } from '@app/drawing/services/export-drawing/export-drawing.service';
import { SaveDrawingService } from '@app/drawing/services/save-drawing/save-drawing.service';
import { HistoryControlsComponent } from '@app/history/component/history-controls/history-controls.component';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { EllipseToolConfigurationComponent } from '@app/tools/components/tool-configurations/ellipse-tool-configuration/ellipse-tool-configuration.component';
import { EraserToolConfigurationComponent } from '@app/tools/components/tool-configurations/eraser-tool-configuration/eraser-tool-configuration.component';
import { LineToolConfigurationComponent } from '@app/tools/components/tool-configurations/line-tool-configuration/line-tool-configuration.component';
import { PencilToolConfigurationComponent } from '@app/tools/components/tool-configurations/pencil-tool-configuration/pencil-tool-configuration.component';
import { PipetteToolConfigurationComponent } from '@app/tools/components/tool-configurations/pipette-tool-configuration/pipette-tool-configuration.component';
import { RectangleToolConfigurationComponent } from '@app/tools/components/tool-configurations/rectangle-tool-configuration/rectangle-tool-configuration.component';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ShapeToolConfigurationComponent } from '@app/tools/components/tool-configurations/shape-tool-configuration/shape-tool-configuration.component';
import { SprayToolConfigurationComponent } from '@app/tools/components/tool-configurations/spray-tool-configuration/spray-tool-configuration.component';
import { ClipboardService } from '@app/tools/services/selection/clipboard/clipboard.service';
import { EllipseSelectionHandlerService } from '@app/tools/services/selection/ellipse/ellipse-selection-handler-service';
import { EllipseSelectionHelperService } from '@app/tools/services/selection/ellipse/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse/ellipse-selection-manipulator.service';
import { LassoSelectionHandlerService } from '@app/tools/services/selection/lasso/lasso-selection-handler.service';
import { LassoSelectionHelperService } from '@app/tools/services/selection/lasso/lasso-selection-helper.service';
import { LassoSelectionManipulatorService } from '@app/tools/services/selection/lasso/lasso-selection-manipulator.service';
import { RectangleSelectionHandlerService } from '@app/tools/services/selection/rectangle/rectangle-selection-handler.service';
import { RectangleSelectionHelperService } from '@app/tools/services/selection/rectangle/rectangle-selection-helper.service';
import { RectangleSelectionManipulatorService } from '@app/tools/services/selection/rectangle/rectangle-selection-manipulator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { EllipseSelectionCreatorService } from '@app/tools/services/tools/ellipse-selection-creator.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EraserService } from '@app/tools/services/tools/eraser/eraser-service';
import { LassoSelectionCreatorService } from '@app/tools/services/tools/lasso-selection-creator/lasso-selection-creator.service';
import { LineService } from '@app/tools/services/tools/line.service';
import { PaintBucketService } from '@app/tools/services/tools/paint-bucket.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { PipetteService } from '@app/tools/services/tools/pipette/pipette-service';
import { PolygonService } from '@app/tools/services/tools/polygon/polygon.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { SprayService } from '@app/tools/services/tools/spray/spray-service';
import { StampService } from '@app/tools/services/tools/stamp/stamp.service';
import { TextService } from '@app/tools/services/tools/text/text.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { SidebarComponent } from './sidebar.component';

// tslint:disable: no-any
// tslint:disable: max-file-line-count
// tslint:disable: max-classes-per-file
// tslint:disable: prefer-const
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolSelectorServiceStub: ToolSelectorService;
    let historyServiceStub: HistoryService;
    let drawingStub: DrawingService;
    let colourServiceStub: ColourService;
    let ellipseToolStub: EllipseService;
    let rectangleService: RectangleService;
    let polygonService: PolygonService;
    let lineServiceStub: LineService;
    let clipboardService: ClipboardService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    let pencilStoolStub: PencilService;
    let pipetteStoolStub: PipetteService;
    let sprayStoolStub: SprayService;
    let drawingCreatorServiceSpy: jasmine.SpyObj<any>;
    let exportDrawingServiceSpy: jasmine.SpyObj<any>;
    let saveDrawingServiceSpy: jasmine.SpyObj<any>;
    let eraserStoolStub: EraserService;
    let textServiceStub: TextService;
    let paintBucketServiceStub: PaintBucketService;
    let stampServiceStub: StampService;

    let ellipseSelectionHandlerService: EllipseSelectionHandlerService;
    let ellipseSelectionManipulatorService: EllipseSelectionManipulatorService;
    let ellipseSelectionHelperService: EllipseSelectionHelperService;
    let ellipseSelectionCreatorService: EllipseSelectionCreatorService;

    let rectangleSelectionHandlerService: RectangleSelectionHandlerService;
    let rectangleSelectionManipulatorService: RectangleSelectionManipulatorService;
    let rectangleSelectionHelperService: RectangleSelectionHelperService;
    let rectangleSelectionCreatorService: RectangleSelectionCreatorService;

    let lassoSelectionHandlerService: LassoSelectionHandlerService;
    let lassoSelectionManipulatorService: LassoSelectionManipulatorService;
    let lassoSelectionHelperService: LassoSelectionHelperService;
    let lassoSelectionCreatorService: LassoSelectionCreatorService;

    class RectangleServiceStub extends RectangleService {
        constructor(drawingService: DrawingService, colourService: ColourService, historyService: HistoryService) {
            super(drawingService, colourService, historyService);
        }
    }

    @Component({
        selector: 'mat-icon',
        template: '<span></span>',
    })
    class MockMatIconComponent {
        @Input() svgIcon: any;
        @Input() fontSet: any;
        @Input() fontIcon: any;
    }

    beforeEach(async(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        drawingStub = new DrawingService(historyServiceStub);
        drawingStub.canvasSize = { x: 500, y: 600 };
        colourServiceStub = new ColourService({} as ColourPickerService);
        pencilStoolStub = new PencilService(drawingStub, colourServiceStub, historyServiceStub);
        sprayStoolStub = new SprayService(drawingStub, colourServiceStub, historyServiceStub);
        pipetteStoolStub = new PipetteService(drawingStub, colourServiceStub, historyServiceStub);
        eraserStoolStub = new EraserService(drawingStub, historyServiceStub);
        ellipseToolStub = new EllipseService(drawingStub, colourServiceStub, historyServiceStub);
        rectangleService = new RectangleServiceStub(drawingStub, colourServiceStub, historyServiceStub);
        polygonService = new PolygonService(drawingStub, colourServiceStub, historyServiceStub);
        drawingCreatorServiceSpy = jasmine.createSpyObj('DrawingCreatorService', ['createNewDrawing']);
        exportDrawingServiceSpy = jasmine.createSpyObj('ExportDrawingService', ['openExportDrawingDialog']);
        saveDrawingServiceSpy = jasmine.createSpyObj('SaveDrawingService', ['openSaveDrawingDialog']);
        lineServiceStub = new LineService(drawingStub, colourServiceStub, historyServiceStub);
        textServiceStub = new TextService(drawingStub, colourServiceStub, historyServiceStub, keyboardServiceStub);
        paintBucketServiceStub = new PaintBucketService(drawingStub, colourServiceStub, historyServiceStub);
        stampServiceStub = new StampService(drawingStub, historyServiceStub);

        ellipseSelectionHelperService = new EllipseSelectionHelperService(drawingStub, colourServiceStub, ellipseToolStub);
        ellipseSelectionHandlerService = new EllipseSelectionHandlerService(drawingStub, ellipseSelectionHelperService);
        ellipseSelectionManipulatorService = new EllipseSelectionManipulatorService(
            drawingStub,
            ellipseSelectionHelperService,
            ellipseSelectionHandlerService,
            historyServiceStub,
        );
        ellipseSelectionCreatorService = new EllipseSelectionCreatorService(
            drawingStub,
            ellipseSelectionManipulatorService,
            ellipseSelectionHelperService,
            clipboardService,
        );

        rectangleSelectionHelperService = new RectangleSelectionHelperService(drawingStub, colourServiceStub, ellipseToolStub);
        rectangleSelectionManipulatorService = new RectangleSelectionManipulatorService(
            drawingStub,
            rectangleSelectionHelperService,
            rectangleSelectionHandlerService,
            historyServiceStub,
        );
        rectangleSelectionManipulatorService = new RectangleSelectionManipulatorService(
            drawingStub,
            rectangleSelectionHelperService,
            rectangleSelectionHandlerService,
            historyServiceStub,
        );
        rectangleSelectionCreatorService = new RectangleSelectionCreatorService(
            drawingStub,
            rectangleSelectionManipulatorService,
            rectangleSelectionHelperService,
            clipboardService,
        );

        lassoSelectionHelperService = new LassoSelectionHelperService(drawingStub, colourServiceStub, ellipseToolStub);
        lassoSelectionHandlerService = new LassoSelectionHandlerService(drawingStub, ellipseSelectionHelperService);
        lassoSelectionManipulatorService = new LassoSelectionManipulatorService(
            drawingStub,
            lassoSelectionHelperService,
            lassoSelectionHandlerService,
            historyServiceStub,
        );
        lassoSelectionCreatorService = new LassoSelectionCreatorService(
            drawingStub,
            lassoSelectionManipulatorService,
            lassoSelectionHelperService,
            clipboardService,
        );

        lineServiceStub = new LineService(drawingStub, colourServiceStub, historyServiceStub);

        toolSelectorServiceStub = new ToolSelectorService(
            keyboardServiceStub,
            clipboardService,
            historyServiceStub,
            pencilStoolStub,
            pipetteStoolStub,
            sprayStoolStub,
            eraserStoolStub,
            ellipseToolStub,
            rectangleService,
            lineServiceStub,
            polygonService,
            ellipseSelectionCreatorService,
            rectangleSelectionCreatorService,
            lassoSelectionCreatorService,
            stampServiceStub,
            textServiceStub,
            paintBucketServiceStub,
        );

        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [
                MatTooltipModule,
                CommonModule,
                MatIconModule,
                MatSliderModule,
                MatDividerModule,
                BrowserAnimationsModule,
                MatIconModule,
                HotkeyModule.forRoot(),
            ],
            declarations: [
                SidebarComponent,
                EllipseToolConfigurationComponent,
                PencilToolConfigurationComponent,
                PipetteToolConfigurationComponent,
                SprayToolConfigurationComponent,
                EraserToolConfigurationComponent,
                RectangleToolConfigurationComponent,
                LineToolConfigurationComponent,
                ResizableToolConfigurationComponent,
                ShapeToolConfigurationComponent,
                HistoryControlsComponent,
            ],
            providers: [
                { provide: ToolSelectorService, useValue: toolSelectorServiceStub },
                { provide: DrawingCreatorService, useValue: drawingCreatorServiceSpy },
                { provide: ExportDrawingService, useValue: exportDrawingServiceSpy },
                { provide: SaveDrawingService, useValue: saveDrawingServiceSpy },
                { provide: ColourService },
                { provide: EllipseService },
                { provide: EraserService },
                { provide: LineService },
                { provide: PencilService },
                { provide: PipetteService },
                { provide: SprayService },
                { provide: RectangleService },
                { provide: EllipseSelectionHandlerService },
                { provide: EllipseSelectionManipulatorService },
                { provide: EllipseSelectionHelperService },
                { provide: EllipseSelectionCreatorService },
                { provide: RectangleSelectionHandlerService },
                { provide: RectangleSelectionManipulatorService },
                { provide: RectangleSelectionHelperService },
                { provide: RectangleSelectionCreatorService },
                { provide: MatIconRegistry, useValue: FakeMatIconRegistry },
                { provide: HotkeysService, useValue: hotkeysServiceStub },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        })
            .overrideModule(MatIconModule, {
                remove: {
                    declarations: [MatIcon],
                    exports: [MatIcon],
                },
                add: {
                    declarations: [MockMatIconComponent],
                    exports: [MockMatIconComponent],
                },
            })
            .compileComponents();

        clipboardService = TestBed.inject(ClipboardService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set selectedToolName to new toolName when calling selectTool', () => {
        const toolName = 'rectangle';
        component.selectTool('rectangle');
        expect(component.selectedToolName).toBe(toolName);
    });

    it('should not set selectedToolName to new toolName when calling selectTool', () => {
        const toolName = 'rectangle-selection';
        component.selectTool('rectangle-selection');
        component.selectTool('fbhsduubgvwehiogfvwruogfihwerguioerhgvuo;p');
        expect(component.selectedToolName).toBe(toolName);
    });

    it('should not return the display name of a tool when getDisplayName is called with a valid tool name', () => {
        const expectedDisplayName = '<Outil inconnu>';
        const obtainedDisplayName: string = component.getDisplayName('fdfs');
        expect(obtainedDisplayName).toBe(expectedDisplayName);
    });

    it('should return the display name of a tool when getDisplayName is called with a valid tool name', () => {
        const expectedDisplayName = 'Crayon';
        const obtainedDisplayName: string = component.getDisplayName('pencil');
        expect(obtainedDisplayName).toBe(expectedDisplayName);
    });

    it("should return '<Outil inconnu>' when asking for a keyboard shortcut of non-existing tool", () => {
        const expectedDisplayName = '<Outil inconnu>';
        const obtainedDisplayName: string = component.getKeyboardShortcut('invalid tool');
        expect(obtainedDisplayName).toBe(expectedDisplayName);
    });

    it("should return '<Outil inconnu>' when asking for a keyboard shortcut of  an existing tool", () => {
        const expectedDisplayName = 'c';
        const obtainedDisplayName: string = component.getKeyboardShortcut('pencil');
        expect(obtainedDisplayName).toBe(expectedDisplayName);
    });

    it('getIconName(toolName) should return the correct icon name if given toolName is valid', () => {
        const expectedIconName = 'pencil';
        const obtainedIconName: string = component.getIconName('pencil');
        expect(obtainedIconName).toBe(expectedIconName);
    });

    it("getIconName(toolName) should return 'unknown' if given toolName is invalid", () => {
        const expectedIconName = 'unknown';
        const obtainedIconName: string = component.getIconName('invalid tool');
        expect(obtainedIconName).toBe(expectedIconName);
    });

    it('createNewDrawing should call DrawingCreatorService createNewDrawing method', () => {
        component.createNewDrawing();
        expect(drawingCreatorServiceSpy.createNewDrawing).toHaveBeenCalled();
    });

    it('exportDrawing should call exportDrawingService.openExportDrawingDialog', () => {
        component.exportDrawing();
        expect(exportDrawingServiceSpy.openExportDrawingDialog).toHaveBeenCalled();
    });

    it('saveDrawing should call saveDrawingService.openSaveDrawingDialog', () => {
        component.saveDrawing();
        expect(saveDrawingServiceSpy.openSaveDrawingDialog).toHaveBeenCalled();
    });
});
