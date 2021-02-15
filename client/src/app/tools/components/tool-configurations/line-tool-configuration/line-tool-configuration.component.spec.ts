import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { LineType } from '@app/shapes/types/line-type';
import { LineService } from '@app/tools/services/tools/line.service';
import { LineToolConfigurationComponent } from './line-tool-configuration.component';

describe('LineToolConfigurationComponent', () => {
    // tslint:disable-next-line: no-magic-numbers
    const SAMPLE_DIAMETERS = [5, 1, 52, 42];
    const LINE_TYPES = [LineType.WITH_JOINTS, LineType.WITHOUT_JOINTS];

    let component: LineToolConfigurationComponent;
    let fixture: ComponentFixture<LineToolConfigurationComponent>;
    let lineServiceStub: jasmine.SpyObj<LineService>;

    beforeEach(async(() => {
        lineServiceStub = jasmine.createSpyObj('LineService', ['setLineType', 'setJointsDiameter']);

        TestBed.configureTestingModule({
            declarations: [LineToolConfigurationComponent],
            providers: [{ provide: LineService, useValue: lineServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LineToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onLineTypeChange() should change the lineType attribute accordingly', () => {
        LINE_TYPES.forEach((initialType) => {
            LINE_TYPES.forEach((giveType) => {
                component.lineType = initialType;
                component.onLineTypeChange({ value: giveType } as MatButtonToggleGroup);
                expect(component.lineType).toEqual(giveType);
            });
        });
    });

    it('onLineTypeChange() should set the line type in the line service to the given parameter', () => {
        LINE_TYPES.forEach((lineType) => {
            component.onLineTypeChange({ value: lineType } as MatButtonToggleGroup);
            expect(lineServiceStub.lineType).toEqual(lineType);
        });
    });

    it('onJointsDiameterChange() should change the jointsDiameter attribute accordingly', () => {
        SAMPLE_DIAMETERS.forEach((initialDiameter) => {
            SAMPLE_DIAMETERS.forEach((givenDiameter) => {
                component.jointsDiameter = initialDiameter;
                component.onJointsDiameterChange(givenDiameter);
                expect(component.jointsDiameter).toEqual(givenDiameter);
            });
        });
    });

    it('onJointsDiameterChange() should set joints diameter in the line service to the given parameter', () => {
        SAMPLE_DIAMETERS.forEach((diameter) => {
            component.onJointsDiameterChange(diameter);
            expect(lineServiceStub.jointsDiameter).toEqual(diameter);
        });
    });
});
