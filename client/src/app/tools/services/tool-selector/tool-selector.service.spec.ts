import { TestBed } from '@angular/core/testing';
import { MetaWrappedTool } from '@app/tools/classes/meta-wrapped-tool';
import { Tool } from '@app/tools/classes/tool';
import { SelectionCreatorService } from '@app/tools/services/selection/selection-base/selection-creator.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { SprayService } from '@app/tools/services/tools/spray-service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:max-line-length
// tslint:disable:no-string-literal
describe('ToolSelectorService', () => {
    let service: ToolSelectorService;

    beforeEach(() => {
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
        service.selectTool('spray');
        const onToolDeselectSpy = spyOn(service.getRegisteredTools().get('spray')?.tool as SprayService, 'onToolDeselect');

        service.selectTool('pencil');

        expect(onToolDeselectSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onToolSelect on new tool when changing to valid tool if new tool implements ISelectableTool', () => {
        service.selectTool('spray');
        const onToolSelectSpy = spyOn(service.getRegisteredTools().get('pencil')?.tool as PencilService, 'onToolSelect');

        service.selectTool('pencil');

        expect(onToolSelectSpy).toHaveBeenCalledTimes(1);
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
});
