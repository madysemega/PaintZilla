import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { MaterialModule } from '@app/material.module';
import { PencilToolConfigurationComponent } from '@app/tools/components/tool-configurations/pencil-tool-configuration/pencil-tool-configuration.component';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { PencilService } from '@app/tools/services/tools/pencil-service';

describe('PencilToolConfigurationComponent', () => {
    let component: PencilToolConfigurationComponent;
    let fixture: ComponentFixture<PencilToolConfigurationComponent>;

    let historyServiceStub: HistoryService;
    let drawingServiceStub: DrawingService;
    let colourServiceStub: ColourService;
    let pencilServiceStub: PencilService;

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingServiceStub = new DrawingService(historyServiceStub);
        colourServiceStub = new ColourService({} as ColourPickerService);
        pencilServiceStub = new PencilService(drawingServiceStub, colourServiceStub, historyServiceStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [PencilToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [{ provide: PencilService, useValue: pencilServiceStub }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
