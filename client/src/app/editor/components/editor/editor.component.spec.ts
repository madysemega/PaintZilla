import { CommonModule } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingLoaderService } from '@app/drawing/services/drawing-loader/drawing-loader.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ExportDrawingService } from '@app/drawing/services/export-drawing/export-drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { SaveDrawingService } from '@app/drawing/services/save-drawing/save-drawing.service';
import { AutomaticSavingService } from '@app/file-options/automatic-saving/automatic-saving.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MagnetismService } from '@app/magnetism/magnetism.service';
import { MaterialModule } from '@app/material.module';
import { ServerService } from '@app/server-communication/service/server.service';
import { Tool } from '@app/tools/classes/tool';
import { ClipboardService } from '@app/tools/services/selection/clipboard/clipboard.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EraserService } from '@app/tools/services/tools/eraser/eraser-service';
import { LineService } from '@app/tools/services/tools/line.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { PipetteService } from '@app/tools/services/tools/pipette/pipette-service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { SprayService } from '@app/tools/services/tools/spray/spray-service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { EditorComponent } from './editor.component';

// tslint:disable: max-classes-per-file
// tslint:disable:no-any
describe('EditorComponent', () => {
    @Component({
        selector: 'mat-icon',
        template: '<span></span>',
    })
    class MockMatIconComponent {
        @Input() svgIcon: any;
        @Input() fontSet: any;
        @Input() fontIcon: any;
    }

    class ToolStub extends Tool {}

    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;

    let historyServiceStub: jasmine.SpyObj<HistoryService>;
    let drawingStub: DrawingService;
    let drawingCreatorServiceSpy: jasmine.SpyObj<any>;
    let colourServiceStub: ColourService;
    let automaticSavingService: jasmine.SpyObj<any>;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    let keyboardZEvent: KeyboardEvent;
    let toolSelectorStub: jasmine.SpyObj<ToolSelectorService>;
    let clipboardServiceStub: jasmine.SpyObj<ClipboardService>;
    let magnetismeServiceStub: jasmine.SpyObj<MagnetismService>;

    let configurationPanelDrawerStub: jasmine.SpyObj<MatDrawer>;

    keyboardZEvent = {
        key: 'Z',
        preventDefault: () => {
            return;
        },
    } as KeyboardEvent;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        historyServiceStub = jasmine.createSpyObj('HistoryService', ['do', 'register', 'undo', 'redo', 'onUndo', 'clear']);
        drawingStub = new DrawingService(historyServiceStub);
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        drawingCreatorServiceSpy = jasmine.createSpyObj('DrawingCreatorService', ['setDefaultCanvasSize', 'onKeyDown', 'noDialogsOpen']);
        automaticSavingService = jasmine.createSpyObj('AutomaticSavingService', ['saveDrawingLocally', 'loadMostRecentDrawing']);
        magnetismeServiceStub = jasmine.createSpyObj('MagnetismService', ['toggleMagnetism']);

        drawingCreatorServiceSpy.noDialogsOpen.and.callFake(() => {
            return true;
        });

        colourServiceStub = new ColourService({} as ColourPickerService);

        toolSelectorStub = jasmine.createSpyObj('ToolSelector', ['selectTool', 'getSelectedTool', 'onToolChanged', 'fromKeyboardShortcut']);
        toolSelectorStub.getSelectedTool.and.returnValue(toolStub);
        toolSelectorStub.getSelectedTool.and.returnValue(toolStub);

        clipboardServiceStub = jasmine.createSpyObj('ClipboardService', ['paste']);
        clipboardServiceStub.copyOwner = toolStub as SelectionCreatorService;
        clipboardServiceStub.copyOwner.key = 'dummyKey';

        configurationPanelDrawerStub = jasmine.createSpyObj('MatDrawer', ['open']);
        configurationPanelDrawerStub.open.and.stub();

        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                RouterTestingModule.withRoutes([]),
                BrowserAnimationsModule,
                HotkeyModule.forRoot(),
                MatIconModule,
                CommonModule,
                MatTooltipModule,
            ],
            declarations: [EditorComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: DrawingCreatorService, useValue: drawingCreatorServiceSpy },
                { provide: HistoryService, useValue: historyServiceStub },
                { provide: ToolSelectorService, useValue: toolSelectorStub },
                { provide: EllipseService },
                { provide: EraserService },
                { provide: PipetteService },
                { provide: SprayService },
                { provide: LineService },
                { provide: RectangleService },
                { provide: ResizingService },
                { provide: MatDialogRef, useValue: {} },
                { provide: HttpClient },
                { provide: HttpHandler },
                { provide: ServerService },
                { provide: KeyboardService },
                { provide: ExportDrawingService },
                { provide: SaveDrawingService },
                { provide: DrawingLoaderService },
                { provide: ColourService, useValue: colourServiceStub },
                { provide: MatIconRegistry, useValue: FakeMatIconRegistry },
                { provide: AutomaticSavingService, useValue: automaticSavingService },
                { provide: ClipboardService, useValue: clipboardServiceStub },
                { provide: MagnetismService, useValue: magnetismeServiceStub },
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
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.configurationPanelDrawer = configurationPanelDrawerStub;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(" should call the tool's key down when receiving a key down event", () => {
        const keyboardEventSpy = spyOn(toolStub, 'onKeyDown').and.callThrough();
        component.onKeyDown(keyboardZEvent);
        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(keyboardZEvent);
    });

    it(" should call the tool's key ip when receiving a key up event", () => {
        const keyboardEventSpy = spyOn(toolStub, 'onKeyUp').and.callThrough();
        component.onKeyUp(keyboardZEvent);
        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(keyboardZEvent);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it("When colour picker visibility state changes, so should the editor component's internal flag", () => {
        const INITIAL_FLAG_VALUE = false;
        const NEW_FLAG_VALUE = true;

        component.showColourPicker = INITIAL_FLAG_VALUE;

        colourServiceStub.showColourPickerChange.subscribe(() => {
            expect(component.showColourPicker).toEqual(NEW_FLAG_VALUE);
        });

        colourServiceStub.showColourPickerChange.emit(NEW_FLAG_VALUE);
    });

    it('When new tool is selected, the configuration drawer should open', () => {
        toolSelectorStub.onToolChanged.and.callFake((callback) => callback());

        // tslint:disable-next-line: no-string-literal
        component['handleToolChange']();

        expect(configurationPanelDrawerStub.open).toHaveBeenCalled();
    });

    it('Mouse down should hide colour picker if it was shown', () => {
        colourServiceStub.showColourPicker = true;
        colourServiceStub.onColourPicker = false;
        component.showColourPicker = true;
        component.onMouseDown({} as MouseEvent);

        expect(colourServiceStub.onColourPicker).toBeFalse();
        expect(component.showColourPicker).toBeFalse();
    });

    it('Mouse down should not hide colour picket if user is on colour picker', () => {
        colourServiceStub.showColourPicker = true;
        colourServiceStub.onColourPicker = true;
        component.showColourPicker = true;
        component.onMouseDown({} as MouseEvent);

        expect(colourServiceStub.onColourPicker).toBeTrue();
        expect(component.showColourPicker).toBeTrue();
    });

    it('updateColour() should propagate event to colour service', () => {
        const colourServiceUpdateColourSpy = spyOn(colourServiceStub, 'updateColour').and.stub();
        component.updateColour();
        expect(colourServiceUpdateColourSpy).toHaveBeenCalled();
    });

    it('height property should be the innerHeight of the window', () => {
        expect(component.height).toEqual(window.innerHeight);
    });

    it('beforeunload event should call automaticSavingService.saveDrawingLocally', () => {
        component.onBeforeUnload({} as Event);
        expect(automaticSavingService.saveDrawingLocally).toHaveBeenCalled();
    });

    it('onload event should call automaticSavingService.loadMostRecentDrawing', () => {
        component.onLoad({} as Event);
        expect(automaticSavingService.loadMostRecentDrawing).toHaveBeenCalled();
    });

    it('when initializing image, if image id is set, should load image from server', () => {
        const loadFromServerSpy = spyOn(TestBed.inject(DrawingLoaderService), 'loadFromServer').and.stub();
        const METHOD_NAME = 'initializeImage';
        const IMAGE_VALUE = '123';

        component[METHOD_NAME](IMAGE_VALUE);

        expect(loadFromServerSpy).toHaveBeenCalledWith(IMAGE_VALUE);
    });
});
