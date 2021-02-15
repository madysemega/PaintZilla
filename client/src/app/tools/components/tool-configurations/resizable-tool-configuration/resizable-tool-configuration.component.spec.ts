import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizableToolConfigurationComponent } from './resizable-tool-configuration.component';

class ResizableToolStub extends ResizableTool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    adjustLineWidth(lineWidth: number): void {
        this.key = 'just-to-test';
        this.lineWidth = lineWidth;
    }
}
// tslint:disable:no-any
describe('ResizableToolConfigurationComponent', () => {
    let component: ResizableToolConfigurationComponent;
    let fixture: ComponentFixture<ResizableToolConfigurationComponent>;
    let resizableToolStub: ResizableTool;
    let drawingServiceStub: DrawingService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResizableToolConfigurationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        drawingServiceStub = new DrawingService();
        resizableToolStub = new ResizableToolStub(drawingServiceStub);
        resizableToolStub.lineWidth = 1;
        fixture = TestBed.createComponent(ResizableToolConfigurationComponent);
        component = fixture.componentInstance;
        component.toolService = resizableToolStub;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changing width should reflect on the toolService line width', () => {
        resizableToolStub.lineWidth = 1;
        component.changeWidth(2);
        expect(resizableToolStub.lineWidth).toEqual(2);
    });
});
