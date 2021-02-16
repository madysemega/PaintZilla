import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MaterialModule } from '@app/material.module';
import { PencilToolConfigurationComponent } from '@app/tools/components/tool-configurations/pencil-tool-configuration/pencil-tool-configuration.component';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';

describe('PencilToolConfigurationComponent', () => {
    let component: PencilToolConfigurationComponent;
    let fixture: ComponentFixture<PencilToolConfigurationComponent>;

    let drawingServiceStub: DrawingService;
    let colourServiceStub: ColourToolService;
    let pencilServiceStub: PencilService;

    beforeEach(async(() => {
        drawingServiceStub = new DrawingService();
        colourServiceStub = new ColourToolService();
        pencilServiceStub = new PencilService(drawingServiceStub, colourServiceStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [PencilToolConfigurationComponent, ResizableToolConfigurationComponent],
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
