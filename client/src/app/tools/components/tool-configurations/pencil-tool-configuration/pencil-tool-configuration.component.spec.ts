import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PencilToolConfigurationComponent } from '@app/components/tool-configurations/pencil-tool-configuration/pencil-tool-configuration.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';

describe('PencilToolConfigurationComponent', () => {
    let component: PencilToolConfigurationComponent;
    let fixture: ComponentFixture<PencilToolConfigurationComponent>;

    let drawingServiceStub: DrawingService;
    let pencilServiceStub: PencilService;

    beforeEach(async(() => {
        drawingServiceStub = new DrawingService();
        pencilServiceStub = new PencilService(drawingServiceStub);

        TestBed.configureTestingModule({
            declarations: [PencilToolConfigurationComponent],
            providers: [{ provide: PencilService, useValue: pencilServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
