import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { EraserToolConfigurationComponent } from '@app/tools/components/tool-configurations/eraser-tool-configuration/eraser-tool-configuration.component';
import { EraserService } from '@app/tools/services/tools/eraser-service';

describe('EraserToolConfigurationComponent', () => {
    let component: EraserToolConfigurationComponent;
    let fixture: ComponentFixture<EraserToolConfigurationComponent>;

    let drawingServiceStub: DrawingService;
    let eraserServiceStub: EraserService;

    beforeEach(async(() => {
        drawingServiceStub = new DrawingService();
        eraserServiceStub = new EraserService(drawingServiceStub);

        TestBed.configureTestingModule({
            declarations: [EraserToolConfigurationComponent],
            providers: [{ provide: EraserService, useValue: eraserServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EraserToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
