import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColourPickerService } from '@app/colour-picker/services/colour-picker/colour-picker.service';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { HistoryService } from '@app/history/service/history.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';
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
    let keyboardServiceStub: jasmine.SpyObj<KeyboardService>;
    let sprayServiceStub: SprayService;
    // tslint:disable-next-line: no-magic-numbers
    const SAMPLE_DIAMETERS = [5, 1, 52, 42];

    beforeEach(async(() => {
        keyboardServiceStub = jasmine.createSpyObj('KeyboardService', ['registerAction', 'saveContext', 'restoreContext']);
        keyboardServiceStub.registerAction.and.stub();
        keyboardServiceStub.saveContext.and.stub();
        keyboardServiceStub.restoreContext.and.stub();
        historyServiceStub = new HistoryService(keyboardServiceStub);
        drawingServiceStub = new DrawingService(historyServiceStub);
        colourServiceStub = new ColourService({} as ColourPickerService);
        sprayServiceStub = new SprayService(drawingServiceStub, colourServiceStub, historyServiceStub);

        TestBed.configureTestingModule({
            imports: [MaterialModule, BrowserAnimationsModule, MatTooltipModule],
            declarations: [SprayToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [{ provide: SprayService, useValue: sprayServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprayToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('onDropDiameterChange() should change the diameter attribute accordingly', () => {
        SAMPLE_DIAMETERS.forEach((initialDiameter) => {
            SAMPLE_DIAMETERS.forEach((givenDiameter) => {
                component.dropDiameter = initialDiameter;
                component.onDropDiameterChange(givenDiameter);
                expect(component.dropDiameter).toEqual(givenDiameter);
            });
        });
    });

    it('onJetDiameterChange() should change the number attribute accordingly', () => {
        SAMPLE_DIAMETERS.forEach((initialDiameter) => {
            SAMPLE_DIAMETERS.forEach((givenDiameter) => {
                component.jetDiameter = initialDiameter;
                component.onJetDiameterChange(givenDiameter);
                expect(component.jetDiameter).toEqual(givenDiameter);
            });
        });
    });

    it('onNbDropsPerSecondChange() should set number in the spray service to the given parameter', () => {
        SAMPLE_DIAMETERS.forEach((diameter) => {
            component.onNbDropsPerSecondChange(diameter);
            expect(sprayServiceStub.nbDropsPerSecond).toEqual(diameter);
        });
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
