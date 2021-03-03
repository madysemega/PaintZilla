import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { MaterialModule } from '@app/material.module';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { SprayToolConfigurationComponent } from '@app/tools/components/tool-configurations/spray-tool-configuration/spray-tool-configuration.component';
import { SprayService } from '@app/tools/services/tools/spray-service';

describe('SprayToolConfigurationComponent', () => {
    let component: SprayToolConfigurationComponent;
    let fixture: ComponentFixture<SprayToolConfigurationComponent>;

    let historyServiceStub: HistoryService;
    let drawingServiceStub: DrawingService;
    let colourServiceStub: ColourService;
    let sprayServiceStub: SprayService;

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingServiceStub = new DrawingService(historyServiceStub);
        colourServiceStub = new ColourService({} as ColourPickerService);
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
