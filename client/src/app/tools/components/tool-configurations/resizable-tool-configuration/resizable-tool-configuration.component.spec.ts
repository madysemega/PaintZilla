import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableTool } from '@app/app/classes/resizable-tool';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { ResizableToolConfigurationComponent } from './resizable-tool-configuration.component';

class ResizableToolStub extends ResizableTool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    adjustLineWidth(): void {
        this.key = 'just-to-test';
    }
}
// tslint:disable:no-any
describe('ResizableToolConfigurationComponent', () => {
    let component: ResizableToolConfigurationComponent;
    let fixture: ComponentFixture<ResizableToolConfigurationComponent>;
    let resizableToolStub: ResizableTool;
    let drawingServiceStub: DrawingService;
    let adjustLineWidthSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResizableToolConfigurationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        drawingServiceStub = new DrawingService();
        resizableToolStub = new ResizableToolStub(drawingServiceStub);
        adjustLineWidthSpy = spyOn<any>(resizableToolStub, 'adjustLineWidth').and.callThrough();
        resizableToolStub.lineWidth = 1;
        fixture = TestBed.createComponent(ResizableToolConfigurationComponent);
        component = fixture.componentInstance;
        component.toolService = resizableToolStub;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changeWidth should update the line width property ', () => {
        component.changeWidth(2);
        expect(component.lineWidth).toEqual(2);
    });

    it('changeWidth should call adjustLineWidth of the toolService ', () => {
        component.changeWidth(2);
        expect(adjustLineWidthSpy).toHaveBeenCalled();
    });
});
