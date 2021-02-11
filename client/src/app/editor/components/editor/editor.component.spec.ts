import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { Tool } from '@app/tools/classes/tool';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { EditorComponent } from './editor.component';

class ToolStub extends Tool {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let keyboardZEvent: KeyboardEvent;

    keyboardZEvent = {
        key: 'Z',
    } as KeyboardEvent;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService();

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: MatDialog, useValue: {} },
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: MatDialogRef, useValue: {} },
            ],
        }).compileComponents();
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
});
