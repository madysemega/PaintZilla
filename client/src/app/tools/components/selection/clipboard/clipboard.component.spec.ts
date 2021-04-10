import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { ClipboardService } from '@app/tools/services/selection/clipboard/clipboard.service';
import { EllipseSelectionHandlerService } from '@app/tools/services/selection/ellipse/ellipse-selection-handler-service';
import { EllipseSelectionHelperService } from '@app/tools/services/selection/ellipse/ellipse-selection-helper.service';
import { EllipseSelectionManipulatorService } from '@app/tools/services/selection/ellipse/ellipse-selection-manipulator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { EllipseSelectionCreatorService } from '@app/tools/services/tools/ellipse-selection-creator.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { ClipboardComponent } from './clipboard.component';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-file-line-count
// tslint:disable:no-unused-expression
class RectangleCreatorMock {
    selectEntireCanvas(): void {}
}

describe('ClipboardComponent', () => {
    let component: ClipboardComponent;
    let fixture: ComponentFixture<ClipboardComponent>;
    let clipboardService: ClipboardService;
    let ellipseSelectionHandlerService: EllipseSelectionHandlerService;
    let ellipseSelectionManipulatorService: EllipseSelectionManipulatorService;
    let ellipseSelectionHelperService: EllipseSelectionHelperService;
    let ellipseSelectionCreatorService: EllipseSelectionCreatorService;
    let drawingStub: DrawingService;
    let historyServiceStub: HistoryService;
    let colourServiceStub: ColourService;
    let ellipseToolStub: EllipseService;
    let pencilService: PencilService;
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(async(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [MatTooltipModule, CommonModule, HotkeyModule.forRoot()],
            declarations: [ClipboardComponent],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        colourServiceStub = new ColourService({} as ColourPickerService);
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);

        drawingStub = new DrawingService(historyServiceStub);
        drawingStub.canvasSize = { x: 500, y: 600 };

        ellipseToolStub = new EllipseService(drawingStub, colourServiceStub, historyServiceStub);

        pencilService = new PencilService(drawingStub, colourServiceStub, historyServiceStub);

        ellipseSelectionHelperService = new EllipseSelectionHelperService(drawingStub, colourServiceStub, ellipseToolStub);
        ellipseSelectionHandlerService = new EllipseSelectionHandlerService(drawingStub, ellipseSelectionHelperService);
        clipboardService = new ClipboardService(drawingStub, ellipseSelectionHelperService, historyServiceStub);
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

        spyOn<any>(ellipseSelectionHandlerService, 'restoreFromMemento').and.callThrough().and.returnValue(true);
        spyOn<any>(ellipseSelectionManipulatorService, 'restoreFromMemento').and.callThrough().and.returnValue(true);
        spyOn<any>(ellipseSelectionManipulatorService, 'drawSelectionOutline').and.callThrough().and.returnValue(true);

        spyOn<any>(ellipseSelectionHandlerService, 'whiteFillAtOriginalLocation').and.returnValue(undefined);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClipboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.toolSelector = TestBed.inject(ToolSelectorService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('isSelectionBeingManipulated should return true if currently selected tool is RectangleSelection and \
    the selection is being manipulated', () => {
        spyOn<any>(component.toolSelector, 'getSelectedTool').and.returnValue(ellipseSelectionCreatorService);
        spyOn<any>(ellipseSelectionCreatorService, 'isSelectionBeingManipulated').and.returnValue(true);
        expect(component.isSelectionBeingManipulated()).toEqual(true);
    });

    it('isSelectionBeingManipulated should return false if currently selected tool is RectangleSelection and \
    the selection is being manipulated', () => {
        spyOn<any>(component.toolSelector, 'getSelectedTool').and.returnValue(pencilService);
        expect(component.isSelectionBeingManipulated()).toEqual(false);
    });

    it('isClipboard empty should return false if it is not empty', () => {
        component.clipboardService.isEmpty = false;
        expect(component.isClipboardEmpty()).toEqual(false);
    });

    it('copy should call copy from the selectionCreator  if the currently selected tool is a selection tool', () => {
        spyOn<any>(component.toolSelector, 'getSelectedTool').and.returnValue(ellipseSelectionCreatorService);
        const copySpy: jasmine.Spy<any> = spyOn<any>(ellipseSelectionCreatorService, 'copy').and.callThrough();
        spyOn<any>(component, 'isSelectionToolCurrentlySelected').and.returnValue(true);
        component.copy();
        expect(copySpy).toHaveBeenCalled();
    });

    it('copy should not call copy from the selectionCreator  if the currently selected tool is not a selection tool', () => {
        const copySpy: jasmine.Spy<any> = spyOn<any>(ellipseSelectionCreatorService, 'copy').and.callThrough();
        spyOn<any>(component, 'isSelectionToolCurrentlySelected').and.returnValue(false);
        component.copy();
        expect(copySpy).not.toHaveBeenCalled();
    });

    it('cut should call cut from the selectionCreator if the currently selected tool is a selection tool', () => {
        spyOn<any>(component.toolSelector, 'getSelectedTool').and.returnValue(ellipseSelectionCreatorService);
        const cutSpy: jasmine.Spy<any> = spyOn<any>(ellipseSelectionCreatorService, 'cut').and.callThrough().and.returnValue(undefined);
        spyOn<any>(component, 'isSelectionToolCurrentlySelected').and.returnValue(true);
        component.cut();
        expect(cutSpy).toHaveBeenCalled();
    });

    it('cut should not call cut from the selectionCreator if the currently selected tool is not a selection tool', () => {
        const cutSpy: jasmine.Spy<any> = spyOn<any>(ellipseSelectionCreatorService, 'cut').and.callThrough().and.returnValue(undefined);
        spyOn<any>(component, 'isSelectionToolCurrentlySelected').and.returnValue(false);
        component.cut();
        expect(cutSpy).not.toHaveBeenCalled();
    });

    it('pasting should lock the history if clipboard is not empty', () => {
        spyOn<any>(component, 'isClipboardEmpty').and.returnValue(false);
        spyOn<any>(clipboardService, 'paste').and.callThrough().and.returnValue(undefined);
        component.historyService = historyServiceStub;
        component.clipboardService.copyOwner = ellipseSelectionCreatorService;
        component.paste();
        expect(historyServiceStub.isLocked).toEqual(true);
    });

    it('pasting should not lock the history if clipboard is empty', () => {
        spyOn<any>(component, 'isClipboardEmpty').and.returnValue(true);
        spyOn<any>(clipboardService, 'paste').and.callThrough().and.returnValue(undefined);
        component.historyService = historyServiceStub;
        component.clipboardService.copyOwner = ellipseSelectionCreatorService;
        component.paste();
        expect(historyServiceStub.isLocked).toEqual(false);
    });

    it('delete should call delete from the selection manipulator if the currently selected tool is a selection tool', () => {
        spyOn<any>(component, 'isSelectionToolCurrentlySelected').and.returnValue(true);
        const deleteSpy: jasmine.Spy<any> = spyOn<any>(ellipseSelectionManipulatorService, 'delete').and.returnValue(undefined);
        spyOn<any>(component.toolSelector, 'getSelectedTool').and.returnValue(ellipseSelectionCreatorService);
        component.delete();
        expect(deleteSpy).toHaveBeenCalled();
    });

    it('delete should not call delete from the selection manipulator if the currently selected tool is not a selection tool ', () => {
        spyOn<any>(component, 'isSelectionToolCurrentlySelected').and.returnValue(false);
        const deleteSpy: jasmine.Spy<any> = spyOn<any>(ellipseSelectionManipulatorService, 'delete').and.returnValue(undefined);
        spyOn<any>(component.toolSelector, 'getSelectedTool').and.returnValue(ellipseSelectionCreatorService);
        component.delete();
        expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('should selectedToolName to rectangle-selection when calling selectTheEntireCanvas', () => {
        const dummyRectangleCreator: RectangleCreatorMock = new RectangleCreatorMock();
        spyOn<any>(component.toolSelector, 'getSelectedTool').and.returnValue(dummyRectangleCreator as RectangleSelectionCreatorService);
        component.selectTheEntireCanvas();
    });

    it('isSelectionToolCurrentlySelected should call getSelectedTool', () => {
        const getSelectedToolSpy: jasmine.Spy<any> = spyOn<any>(component.toolSelector, 'getSelectedTool').and.returnValue(
            ellipseSelectionCreatorService,
        );
        component.isSelectionToolCurrentlySelected();
        expect(getSelectedToolSpy).toHaveBeenCalled();
    });
});
