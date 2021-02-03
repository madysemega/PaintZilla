import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { PencilToolConfigurationComponent } from './pencil-tool-configuration.component';

const EXPECTED_WIDTH = 10;
const SLIDER_WIDTH = 20;

describe('PencilToolConfigurationComponent', () => {
    let component: PencilToolConfigurationComponent;
    let fixture: ComponentFixture<PencilToolConfigurationComponent>;

    let drawingServiceStub: DrawingService;
    let pencilServiceStub: PencilService;

    let sliderChange: MatSliderChange;

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

    it('lineWidth should be equal to PencilService.lineWidth after the component creation', () => {
        pencilServiceStub.lineWidth = EXPECTED_WIDTH;
        component.ngOnInit();
        expect(component.lineWidth).toEqual(EXPECTED_WIDTH);
    });

    it('onSliderChange should change the PencilService lineWidth', () => {
        sliderChange = {
            value: SLIDER_WIDTH,
        } as MatSliderChange;
        component.onSliderChange(sliderChange);
        expect(pencilServiceStub.lineWidth).toEqual(SLIDER_WIDTH);
    });
});
