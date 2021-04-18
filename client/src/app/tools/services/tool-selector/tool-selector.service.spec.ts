import { TestBed } from '@angular/core/testing';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MetaWrappedTool } from '@app/tools/classes/meta-wrapped-tool';
import { Tool } from '@app/tools/classes/tool';
import { ClipboardService } from '@app/tools/services/selection/clipboard/clipboard.service';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { LineService } from '@app/tools/services/tools/line.service';
import { RectangleSelectionCreatorService } from '@app/tools/services/tools/rectangle-selection-creator.service';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-line-length
// tslint:disable:max-file-line-count
// tslint:disable:no-string-literal


describe('ToolSelectorService', () => {
    let service: ToolSelectorService;

    let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

    beforeEach(() => {
        hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
        });
        service = TestBed.inject(ToolSelectorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("should change tool to pencil when selectTool('pencil') is called", () => {
        service.selectTool('pencil');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('pencil') as MetaWrappedTool).tool);
    });
    it("should change tool to pipette when selectTool('pipette') is called", () => {
        service.selectTool('pipette');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('pipette') as MetaWrappedTool).tool);
    });
    it("should change tool to spray when selectTool('spray') is called", () => {
        service.selectTool('spray');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('spray') as MetaWrappedTool).tool);
    });
    it("should change tool to eraser when selectTool('eraser') is called", () => {
        service.selectTool('eraser');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('eraser') as MetaWrappedTool).tool);
    });

    it("should change tool to rect when selectTool('rectangle') is called", () => {
        service.selectTool('rectangle');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('rectangle') as MetaWrappedTool).tool);
    });

    it("should change tool to ellipse when selectTool('ellipse') is called", () => {
        service.selectTool('ellipse');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('ellipse') as MetaWrappedTool).tool);
    });

    it('selectTool should return false if it is called with undefined', () => {
        const output: boolean = service.selectTool(undefined);
        expect(output).toBe(false);
    });

    it('should return a selectionCreatorService when getActiveSelectionTool is called and the currently selected tool is a selectionCreatorService', () => {
        service.selectTool('rectangle-selection');

        expect(service.getActiveSelectionTool()).toBe(
            (service.getRegisteredTools().get('rectangle-selection') as MetaWrappedTool).tool as SelectionCreatorService,
        );
    });

    it('should return undefined when getActiveSelectionTool is called and the currently selected tool is not a selectionCreatorService', () => {
        service.selectTool('pencil');

        expect(service.getActiveSelectionTool()).toBe(undefined);
    });

    it("fromKeyboardShortcut should map 'c' to 'pencil'", () => {
        const expectedToolName = 'pencil';
        const toolName = service.fromKeyboardShortcut('c');
        expect(toolName).toBe(expectedToolName);
    });

    it("fromKeyboardShortcut should map 'i' to 'pipette'", () => {
        const expectedToolName = 'pipette';
        const toolName = service.fromKeyboardShortcut('i');
        expect(toolName).toBe(expectedToolName);
    });
    it("fromKeyboardShortcut should map 'a' to 'spray'", () => {
        const expectedToolName = 'spray';
        const toolName = service.fromKeyboardShortcut('a');
        expect(toolName).toBe(expectedToolName);
    });
    it("fromKeyboardShortcut should map 'e' to 'eraser'", () => {
        const expectedToolName = 'eraser';
        const toolName = service.fromKeyboardShortcut('e');
        expect(toolName).toBe(expectedToolName);
    });

    it("fromKeyboardShortcut should map '1' to 'rectangle'", () => {
        const expectedToolName = 'rectangle';
        const toolName = service.fromKeyboardShortcut('1');
        expect(toolName).toBe(expectedToolName);
    });

    it("fromKeyboardShortcut should map '2' to 'ellipse'", () => {
        const expectedToolName = 'ellipse';
        const toolName = service.fromKeyboardShortcut('2');
        expect(toolName).toBe(expectedToolName);
    });

    it("fromKeyboardShortcut should map 'aa' to undefined", () => {
        const toolName = service.fromKeyboardShortcut('aa');
        expect(toolName).toBe(undefined);
    });

    it('should keep last selected tool when user tries to select a non-existent tool', () => {
        service.selectTool('pencil');
        service.selectTool('invalid tool');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('pencil') as MetaWrappedTool).tool);
    });

    it('should return the correct display name when calling getDisplayName with a valid tool name', () => {
        const displayName = service.getDisplayName('pencil');
        expect(displayName).toBe('Crayon');
    });

    it('should return undefined when calling getDisplayName with an invalid tool name', () => {
        const displayName = service.getDisplayName('invalid tool');
        expect(displayName).toBe(undefined);
    });

    it('should call onToolDeselect on current tool when changing to valid tool if current tool implements IDeselectableTool', () => {
        service.selectTool('line');
        const onToolDeselectSpy = spyOn(service.getRegisteredTools().get('line')?.tool as LineService, 'onToolDeselect');

        service.selectTool('pencil');

        expect(onToolDeselectSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onToolDeselect on current tool when deselect is called if currentTool implements IDeselectableTool', () => {
        service.selectTool('line');
        const onToolDeselectSpy = spyOn(service.getRegisteredTools().get('line')?.tool as LineService, 'onToolDeselect');

        service.deselect();

        expect(onToolDeselectSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call onToolDeselect on current tool when deselect is called if currentTool implements IDeselectableTool', () => {
        
        const nonDeselectableTool = jasmine.createSpyObj('Tool', [
            'onKeyDown',
            'onKeyUp',
            'onMouseDown',
            'onMouseUp',
            'onMouseClick',
            'onMouseDoubleClick',
            'onMouseMove',
            'onMouseLeave',
            'onMouseEnter',
            'getPositionFromMouse',
        ]);
        
        service['tools'].set('test', {
            displayName: 'Test',
            icon: 'test',
            keyboardShortcut: 't',
            tool: nonDeselectableTool as Tool,
        });

        service.selectTool('test');
        service.deselect();

        const returnValue = service.selectTool('pencil');
        expect(returnValue).toBeTrue();
    });

    it('When deselecting a non-deselectable tool, action should still be valid, but do nothing', () => {
        const nonDeselectableTool = jasmine.createSpyObj('Tool', [
            'onKeyDown',
            'onKeyUp',
            'onMouseDown',
            'onMouseUp',
            'onMouseClick',
            'onMouseDoubleClick',
            'onMouseMove',
            'onMouseLeave',
            'onMouseEnter',
            'getPositionFromMouse',
        ]);

        service['tools'].set('test', {
            displayName: 'Test',
            icon: 'test',
            keyboardShortcut: 't',
            tool: nonDeselectableTool,
        });

        service.selectTool('test');
        const returnValue = service.selectTool('pencil');
        expect(returnValue).toBeTrue();
    });

    it('should not crash when selecting a tool which does not implement ISelectableTool', () => {
        service['tools'].set('not-selectable', { tool: {} as Tool } as MetaWrappedTool);
        service.selectTool('not-selectable');
        expect(service.selectedTool).toBeTruthy();
    });

    it('should not crash when deselecting a tool which does not implement IDeselectableTool', () => {
        service['tools'].set('not-deselectable', { tool: {} as Tool } as MetaWrappedTool);
        service.selectTool('not-deselectable');
        expect(service.selectedTool).toBeTruthy();
    });

    it('changing tool should call callbacks registered for onToolChanged event', () => {
        let callbackCalled = false;
        service.onToolChanged(() => (callbackCalled = true));
        service.selectTool('ellipse');
        expect(callbackCalled).toBeTrue();
    });

    it('Tool keyboard shortcuts should select their tool', () => {
        const TOOL_NAMES = ['line'];
        const keyboardService = TestBed.inject(KeyboardService);

        const selectToolSpy = spyOn(service, 'selectTool').and.stub();

        // Invoke the tool shortcuts
        TOOL_NAMES.forEach((name) => {
            spyOn(keyboardService, 'registerAction').and.callFake((action) => {
                if (action.uniqueName === `Change tool to ${name}`) {
                    action.invoke();
                }
            });
        });

        // Execute
        service['registerKeyboardShortcuts']();

        // Assert
        TOOL_NAMES.forEach((name) => {
            expect(selectToolSpy).toHaveBeenCalledWith(name);
        });
    });

    it('Ctrl+A should select rectangle-selection tool', () => {
        service.selectTool('rectangle-selection');

        const keyboardService = TestBed.inject(KeyboardService);
        const selectToolSpy = spyOn(service, 'selectTool').and.stub();

        spyOn(service.selectedTool.tool as RectangleSelectionCreatorService, 'selectEntireCanvas').and.stub();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'ctrl+a') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(selectToolSpy).toHaveBeenCalledWith('rectangle-selection');
    });

    it('Ctrl+A should select the entire canvas', () => {
        service.selectTool('rectangle-selection');

        const keyboardService = TestBed.inject(KeyboardService);
        const selectEntireCanvasSpy = spyOn(service.selectedTool.tool as RectangleSelectionCreatorService, 'selectEntireCanvas').and.stub();

        spyOn(service, 'selectTool').and.stub();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'ctrl+a') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(selectEntireCanvasSpy).toHaveBeenCalled();
    });

    it('If tool is a selection tool, Ctrl+C should copy selection to clipboard', () => {
        service.selectTool('rectangle-selection');

        const keyboardService = TestBed.inject(KeyboardService);
        const selectionService = service.selectedTool.tool as SelectionCreatorService;
        const copySpy = spyOn(selectionService, 'copy').and.stub();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'ctrl+c') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(copySpy).toHaveBeenCalled();
    });

    it('If tool is not a selection tool, Ctrl+C should not copy selection to clipboard', () => {
        service.selectTool('line');

        const keyboardService = TestBed.inject(KeyboardService);
        const copySpy = jasmine.createSpy('copy').and.stub();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'ctrl+c') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(copySpy).not.toHaveBeenCalled();
    });

    it('If tool is a selection tool, Ctrl+X should cut selection to clipboard', () => {
        service.selectTool('rectangle-selection');

        const keyboardService = TestBed.inject(KeyboardService);
        const selectionService = service.selectedTool.tool as SelectionCreatorService;
        const cutSpy = spyOn(selectionService, 'cut').and.stub();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'ctrl+x') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(cutSpy).toHaveBeenCalled();
    });

    it('If tool is not a selection tool, Ctrl+X should not cut selection to clipboard', () => {
        service.selectTool('line');

        const keyboardService = TestBed.inject(KeyboardService);
        const cutSpy = jasmine.createSpy('cut').and.stub();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'ctrl+x') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(cutSpy).not.toHaveBeenCalled();
    });

    it('If tool is a selection tool, del should delete selection', () => {
        service.selectTool('rectangle-selection');

        const keyboardService = TestBed.inject(KeyboardService);
        const selectionService = service.selectedTool.tool as SelectionCreatorService;
        const delSpy = spyOn(selectionService, 'delete').and.stub();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'del') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(delSpy).toHaveBeenCalled();
    });

    it('If tool is not a selection tool, del should not delete selection', () => {
        service.selectTool('line');

        const keyboardService = TestBed.inject(KeyboardService);
        const deleteSpy = jasmine.createSpy('del').and.stub();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'del') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('Ctrl+V should paste clipboard content to drawing surface', () => {
        service.selectTool('rectangle-selection');

        const selectionService = service.selectedTool.tool as SelectionCreatorService;
        const keyboardService = TestBed.inject(KeyboardService);
        const clipboardService = TestBed.inject(ClipboardService);
        const pasteSpy = spyOn(clipboardService, 'paste').and.returnValue();

        clipboardService.copyOwner = selectionService;
        clipboardService.copyOwner = selectionService;
        clipboardService.isEmpty = false;

        spyOn(service, 'selectTool').and.stub();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'ctrl+v') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(pasteSpy).toHaveBeenCalled();
    });

    it('Ctrl+V should lock history service if clipboard is not empty', () => {
        service.selectTool('rectangle-selection');

        const selectionService = service.selectedTool.tool as SelectionCreatorService;
        const keyboardService = TestBed.inject(KeyboardService);
        const clipboardService = TestBed.inject(ClipboardService);
        const historyService = TestBed.inject(HistoryService);

        clipboardService.copyOwner = selectionService;
        clipboardService.isEmpty = false;

        spyOn(service, 'selectTool').and.stub();
        spyOn(clipboardService, 'paste').and.returnValue();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'ctrl+v') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(historyService.isLocked).toBeTrue();
    });

    it('Ctrl+V should not lock history service if clipboard is empty', () => {
        service.selectTool('rectangle-selection');

        const selectionService = service.selectedTool.tool as SelectionCreatorService;
        const keyboardService = TestBed.inject(KeyboardService);
        const clipboardService = TestBed.inject(ClipboardService);
        const historyService = TestBed.inject(HistoryService);

        clipboardService.copyOwner = selectionService;
        clipboardService.isEmpty = true;

        spyOn(service, 'selectTool').and.stub();
        spyOn(clipboardService, 'paste').and.returnValue();

        spyOn(keyboardService, 'registerAction').and.callFake((action) => {
            if (action.trigger === 'ctrl+v') {
                action.invoke();
            }
        });

        service['registerKeyboardShortcuts']();

        expect(historyService.isLocked).not.toBeTrue();
    });
});
