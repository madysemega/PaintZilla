import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { SidebarComponent } from '@app/drawing/components/sidebar/sidebar.component';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { HistoryService } from '@app/history/service/history.service';
import { Tool } from '@app/tools/classes/tool';
import { EllipseToolConfigurationComponent } from '@app/tools/components/tool-configurations/ellipse-tool-configuration/ellipse-tool-configuration.component';
import { LineToolConfigurationComponent } from '@app/tools/components/tool-configurations/line-tool-configuration/line-tool-configuration.component';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EraserService } from '@app/tools/services/tools/eraser-service';
import { LineService } from '@app/tools/services/tools/line.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { EditorComponent } from './editor.component';

// tslint:disable:no-any
// tslint:disable: max-classes-per-file
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
    let keyboardZEvent: KeyboardEvent;
    let drawingCreatorServiceSpy: jasmine.SpyObj<any>;
    let toolSelectorStub: jasmine.SpyObj<any>;

    keyboardZEvent = {
        key: 'Z',
        preventDefault: () => {
            return;
        },
    } as KeyboardEvent;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        historyServiceStub = jasmine.createSpyObj('HistoryService', ['do', 'register', 'undo', 'redo', 'onUndo']);
        drawingStub = new DrawingService(historyServiceStub);
        toolSelectorStub = jasmine.createSpyObj('ToolSelector', ['selectTool', 'getSelectedTool', 'fromKeyboardShortcut']);
        drawingCreatorServiceSpy = jasmine.createSpyObj('DrawingCreatorService', ['setDefaultCanvasSize', 'onKeyDown']);

        toolSelectorStub.getSelectedTool.and.returnValue(toolStub);

        TestBed.configureTestingModule({
            imports: [],
            declarations: [DrawingComponent, SidebarComponent, EllipseToolConfigurationComponent, LineToolConfigurationComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: DrawingCreatorService, useValue: drawingCreatorServiceSpy },
                { provide: HistoryService, useValue: historyServiceStub },
                { provide: ToolSelectorService, useValue: toolSelectorStub },
                { provide: EllipseService },
                { provide: EraserService },
                { provide: LineService },
                { provide: RectangleService },
                { provide: ResizingService },
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
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
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

    it('Ctrl+a should select the rectangle-selection tool from the tool selector', () => {
        const keyboardEvent = {
            ctrlKey: true,
            key: 'a',
        } as KeyboardEvent;
        component.onKeyDown(keyboardEvent);
        expect(toolSelectorStub.selectTool).toHaveBeenCalled();
    });

    it('Ctrl+Z should call history service undo method', () => {
        const keyboardEvent = {
            ctrlKey: true,
            shiftKey: false,
            key: 'Z',
        } as KeyboardEvent;
        component.onKeyUp(keyboardEvent);
        expect(historyServiceStub.undo).toHaveBeenCalled();
    });

    it('Ctrl+Shift+Z should call history service redo method', () => {
        const keyboardEvent = {
            ctrlKey: true,
            shiftKey: true,
            key: 'Z',
        } as KeyboardEvent;
        component.onKeyUp(keyboardEvent);
        expect(historyServiceStub.redo).toHaveBeenCalled();
    });
});
