import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse-service.service';
import { EllipseToolConfigurationComponent } from './ellipse-tool-configuration.component';

// tslint:disable:no-any
describe('EllipseToolConfigurationComponent', () => {
    let component: EllipseToolConfigurationComponent;
    let fixture: ComponentFixture<EllipseToolConfigurationComponent>;
    let drawingStub: DrawingService;
    let ellipseToolStub: EllipseService;

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        ellipseToolStub = new EllipseService(drawingStub);

        TestBed.configureTestingModule({
            declarations: [EllipseToolConfigurationComponent],
            providers: [{ provide: EllipseService, useValue: ellipseToolStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
