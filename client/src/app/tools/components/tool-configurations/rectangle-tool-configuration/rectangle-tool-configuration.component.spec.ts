import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { RectangleToolConfigurationComponent } from './rectangle-tool-configuration.component';

// tslint:disable:no-any
describe('RectangleToolConfigurationComponent', () => {
    let component: RectangleToolConfigurationComponent;
    let fixture: ComponentFixture<RectangleToolConfigurationComponent>;
    let drawingStub: DrawingService;
    let rectangleToolStub: RectangleService;

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        rectangleToolStub = new RectangleService(drawingStub);

        TestBed.configureTestingModule({
            declarations: [RectangleToolConfigurationComponent],
            providers: [{ provide: RectangleService, useValue: rectangleToolStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
