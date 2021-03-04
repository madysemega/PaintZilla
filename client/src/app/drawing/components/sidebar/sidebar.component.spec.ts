import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { EllipseToolConfigurationComponent } from '@app/tools/components/tool-configurations/ellipse-tool-configuration/ellipse-tool-configuration.component';
import { EraserToolConfigurationComponent } from '@app/tools/components/tool-configurations/eraser-tool-configuration/eraser-tool-configuration.component';
import { LineToolConfigurationComponent } from '@app/tools/components/tool-configurations/line-tool-configuration/line-tool-configuration.component';
import { PencilToolConfigurationComponent } from '@app/tools/components/tool-configurations/pencil-tool-configuration/pencil-tool-configuration.component';
import { RectangleToolConfigurationComponent } from '@app/tools/components/tool-configurations/rectangle-tool-configuration/rectangle-tool-configuration.component';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ShapeToolConfigurationComponent } from '@app/tools/components/tool-configurations/shape-tool-configuration/shape-tool-configuration.component';
import { EllipseSelectionHandlerService } from '@app/tools/services/selection/ellipse/ellipse-selection-handler-service';
import { EllipseSelectionHelperService } from '@app/tools/services/selection/ellipse/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse/ellipse-selection-manipulator.service';
import { RectangleSelectionHandlerService } from '@app/tools/services/selection/rectangle/rectangle-selection-handler.service';
import { RectangleSelectionHelperService } from '@app/tools/services/selection/rectangle/rectangle-selection-helper.service';
import { RectangleSelectionManipulatorService } from '@app/tools/services/selection/rectangle/rectangle-selection-manipulator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
//import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { EllipseSelectionCreatorService } from '@app/tools/services/tools/ellipse-selection-creator.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EraserService } from '@app/tools/services/tools/eraser-service';
import { LineService } from '@app/tools/services/tools/line.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { SidebarComponent } from './sidebar.component';

// tslint:disable:no-any
// tslint:disable: max-classes-per-file
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolSelectorServiceStub: ToolSelectorService;
    let historyServiceStub: HistoryService;
    let drawingStub: DrawingService;
    let colourServiceStub: ColourService;
    let ellipseToolStub: EllipseService;
    let rectangleService: RectangleService;
    let lineServiceStub: LineService;
    
    let pencilStoolStub: PencilService;
    let drawingCreatorServiceSpy: jasmine.SpyObj<any>;
    let eraserStoolStub: EraserService;

    let ellipseSelectionHandlerService: EllipseSelectionHandlerService;
    let ellipseSelectionManipulatorService: EllipseSelectionManipulatorService;
    let ellipseSelectionHelperService: EllipseSelectionHelperService;
    let ellipseSelectionCreatorService: EllipseSelectionCreatorService;

    let rectangleSelectionHandlerService: RectangleSelectionHandlerService;
    let rectangleSelectionManipulatorService: RectangleSelectionManipulatorService;
    let rectangleSelectionHelperService: RectangleSelectionHelperService;
    let rectangleSelectionCreatorService: RectangleSelectionCreatorService;
    
    class RectangleServiceStub extends RectangleService {
        constructor(drawingService: DrawingService, colourService: ColourService) {
            super(drawingService, colourService);
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
        historyServiceStub = new HistoryService();
        drawingStub = new DrawingService(historyServiceStub);
        colourServiceStub = new ColourService({} as ColourPickerService);
        pencilStoolStub = new PencilService(drawingStub, colourServiceStub);
        eraserStoolStub = new EraserService(drawingStub);
        ellipseToolStub = new EllipseService(drawingStub, colourServiceStub);
        rectangleService = new RectangleServiceStub(drawingStub, colourServiceStub);
        drawingCreatorServiceSpy = jasmine.createSpyObj('DrawingCreatorService', ['createNewDrawing']);
        lineServiceStub = new LineService(drawingStub, colourServiceStub, historyServiceStub);
        
        ellipseSelectionHelperService = new EllipseSelectionHelperService(drawingStub, colourServiceStub, ellipseToolStub);
        ellipseSelectionHandlerService = new EllipseSelectionHandlerService(drawingStub, ellipseSelectionHelperService);
        ellipseSelectionManipulatorService = new EllipseSelectionManipulatorService(drawingStub, ellipseSelectionHelperService, ellipseSelectionHandlerService, historyServiceStub);
        ellipseSelectionCreatorService = new EllipseSelectionCreatorService(drawingStub, ellipseSelectionManipulatorService, ellipseSelectionHelperService);

        rectangleSelectionHelperService = new RectangleSelectionHelperService(drawingStub, colourServiceStub, ellipseToolStub);
        rectangleSelectionManipulatorService = new RectangleSelectionManipulatorService(drawingStub, rectangleSelectionHelperService, rectangleSelectionHandlerService, historyServiceStub);
        rectangleSelectionManipulatorService = new RectangleSelectionManipulatorService(drawingStub, rectangleSelectionHelperService, rectangleSelectionHandlerService, historyServiceStub);
        rectangleSelectionCreatorService = new RectangleSelectionCreatorService(drawingStub, rectangleSelectionManipulatorService, rectangleSelectionHelperService);

        toolSelectorServiceStub = new ToolSelectorService(pencilStoolStub, eraserStoolStub, ellipseToolStub, rectangleService, lineServiceStub, ellipseSelectionCreatorService, rectangleSelectionCreatorService);
        lineServiceStub = new LineService(drawingStub, colourServiceStub, historyServiceStub);
        toolSelectorServiceStub = new ToolSelectorService(pencilStoolStub, eraserStoolStub, ellipseToolStub, rectangleService, lineServiceStub, ellipseSelectionCreatorService, rectangleSelectionCreatorService);

        TestBed.configureTestingModule({
            imports: [MatTooltipModule, MatIconModule, MatSliderModule, MatDividerModule],
            declarations: [
                SidebarComponent,
                EllipseToolConfigurationComponent,
                PencilToolConfigurationComponent,
                EraserToolConfigurationComponent,
                RectangleToolConfigurationComponent,
                LineToolConfigurationComponent,
                ResizableToolConfigurationComponent,
                ShapeToolConfigurationComponent,
            ],
            providers: [
                { provide: ToolSelectorService, useValue: toolSelectorServiceStub },
                { provide: DrawingCreatorService, useValue: drawingCreatorServiceSpy },
                { provide: ColourService },
                { provide: EllipseService },
                { provide: EraserService },
                { provide: LineService },
                { provide: PencilService },
                { provide: RectangleService },
                { provide: EllipseSelectionHandlerService },
                { provide: EllipseSelectionManipulatorService },
                { provide: EllipseSelectionHelperService },
                { provide: EllipseSelectionCreatorService },
                { provide: RectangleSelectionHandlerService },
                { provide: RectangleSelectionManipulatorService },
                { provide: RectangleSelectionHelperService },
                { provide: RectangleSelectionCreatorService },
            ],
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

    it('should return <Outil inconnu>', () => {
        const toolName = 'rectangle';
        component.selectTool('rectangle');
        expect(component.selectedToolName).toBe(toolName);
    });

    it('should return the display name of a tool when getDisplayName is called with a valid tool name', () => {
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
});
