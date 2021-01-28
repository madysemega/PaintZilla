import { TestBed } from '@angular/core/testing';
import { PencilService } from '@app/services/tools/pencil-service';
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

    it('should change tool to pencil when selectTool(\'pencil\') is called', () => {
        service.selectTool('pencil');
        expect(service.getSelectedTool() instanceof PencilService).toBeTruthy();
    });
});
