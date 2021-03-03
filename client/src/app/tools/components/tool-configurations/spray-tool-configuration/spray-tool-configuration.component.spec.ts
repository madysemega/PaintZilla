import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MaterialModule } from '@app/material.module';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { SprayToolConfigurationComponent } from '@app/tools/components/tool-configurations/spray-tool-configuration/spray-tool-configuration.component';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
import { SprayService } from '@app/tools/services/tools/spray-service';

describe('SprayToolConfigurationComponent', () => {
    let component: SprayToolConfigurationComponent;
    let fixture: ComponentFixture<SprayToolConfigurationComponent>;

    let drawingServiceStub: DrawingService;
    let colourServiceStub: ColourToolService;
    let sprayServiceStub: SprayService;

    beforeEach(async(() => {
        drawingServiceStub = new DrawingService();
        colourServiceStub = new ColourToolService();
        sprayServiceStub = new SprayService(drawingServiceStub, colourServiceStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [SprayToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [{ provide: SprayService, useValue: sprayServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprayToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
