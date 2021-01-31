import { TestBed } from '@angular/core/testing';
import { NamedTool } from '@app/classes/named-tool';
import { ToolSelectorService } from './tool-selector.service';

describe('ToolSelectorService', () => {
    let service: ToolSelectorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolSelectorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("should change tool to pencil when selectTool('pencil') is called", () => {
        service.selectTool('pencil');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('pencil') as NamedTool).tool);
    });

    it('should keep last selected tool when user tries to select a non-existent tool', () => {
        service.selectTool('pencil');
        service.selectTool('invalid tool');
        expect(service.getSelectedTool()).toBe((service.getRegisteredTools().get('pencil') as NamedTool).tool);
    });

    it('should return the correct display name when calling getDisplayName with a valid tool name', () => {
        const displayName = service.getDisplayName('pencil');
        expect(displayName).toBe('Crayon');
    });

    it('should return undefined when calling getDisplayName with an invalid tool name', () => {
        const displayName = service.getDisplayName('invalid tool');
        expect(displayName).toBe(undefined);
    });
});
