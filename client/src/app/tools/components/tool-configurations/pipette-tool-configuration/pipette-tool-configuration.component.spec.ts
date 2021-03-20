import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { MaterialModule } from '@app/material.module';
import { PipetteToolConfigurationComponent } from '@app/tools/components/tool-configurations/pipette-tool-configuration/pipette-tool-configuration.component';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { PipetteService } from '@app/tools/services/tools/pipette-service';

describe('PipetteToolConfigurationComponent', () => {
    let component: PipetteToolConfigurationComponent;
    let fixture: ComponentFixture<PipetteToolConfigurationComponent>;

    let historyServiceStub: HistoryService;
    let drawingServiceStub: DrawingService;
    let colourServiceStub: ColourService;
    let pipetteServiceStub: PipetteService;

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingServiceStub = new DrawingService(historyServiceStub);
        colourServiceStub = new ColourService({} as ColourPickerService);
        pipetteServiceStub = new PipetteService(drawingServiceStub, colourServiceStub, historyServiceStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [PipetteToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [{ provide: PipetteService, useValue: pipetteServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PipetteToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
