import { TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
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
        expect(service.getSelectedTool()).toEqual(service.getRegisteredTools().get('pencil') as Tool);
    });

    it('should keep last selected tool when user tries to select a non-existent tool', () => {
        service.selectTool('pencil');
        service.selectTool('invalid tool');
        expect(service.getSelectedTool()).toEqual(service.getRegisteredTools().get('pencil') as Tool);
    });
});
