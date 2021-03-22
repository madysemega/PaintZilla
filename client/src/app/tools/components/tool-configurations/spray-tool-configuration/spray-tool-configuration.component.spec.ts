import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    // tslint:disable-next-line: no-magic-numbers
    const SAMPLE_DIAMETERS = [5, 1, 52, 42];

    beforeEach(async(() => {
        historyServiceStub = new HistoryService();
        drawingServiceStub = new DrawingService(historyServiceStub);
        colourServiceStub = new ColourService({} as ColourPickerService);
        sprayServiceStub = new SprayService(drawingServiceStub, colourServiceStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule, BrowserAnimationsModule],
            declarations: [SprayToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [{ provide: SprayService, useValue: sprayServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprayToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('onDiameterPointChange() should change the diameter attribute accordingly', () => {
        SAMPLE_DIAMETERS.forEach((initialDiameter) => {
            SAMPLE_DIAMETERS.forEach((givenDiameter) => {
                component.diameterChange = initialDiameter;
                component.onDiameterPointChange(givenDiameter);
                expect(component.diameterChange).toEqual(givenDiameter);
            });
        });
    });

    it('onDiameterPointChange() should set diameter in the spray service to the given parameter', () => {
        SAMPLE_DIAMETERS.forEach((diameter) => {
            component.onDiameterPointChange(diameter);
            expect(sprayServiceStub.diameterDraw).toEqual(diameter);
        });
    });
    it('onNumberPointChange() should change the number attribute accordingly', () => {
        SAMPLE_DIAMETERS.forEach((initialDiameter) => {
            SAMPLE_DIAMETERS.forEach((givenDiameter) => {
                component.numberChange = initialDiameter;
                component.onNumberPointChange(givenDiameter);
                expect(component.numberChange).toEqual(givenDiameter);
            });
        });
    });

    it('onNumberPointChange() should set number in the spray service to the given parameter', () => {
        SAMPLE_DIAMETERS.forEach((diameter) => {
            component.onNumberPointChange(diameter);
            expect(sprayServiceStub.numberPoints).toEqual(diameter);
        });
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
