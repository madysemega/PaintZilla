import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EllipseToolConfigurationComponent } from './ellipse-tool-configuration.component';

// tslint:disable:no-any
describe('EllipseToolConfigurationComponent', () => {
    let component: EllipseToolConfigurationComponent;
    let fixture: ComponentFixture<EllipseToolConfigurationComponent>;
    let drawingStub: DrawingService;
    let colourServiceStub: ColourToolService;
    let ellipseToolStub: EllipseService;

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        colourServiceStub = new ColourToolService();
        ellipseToolStub = new EllipseService(drawingStub, colourServiceStub);

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
