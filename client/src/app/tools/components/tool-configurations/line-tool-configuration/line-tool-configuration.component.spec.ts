import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { LineType } from '@app/shapes/types/line-type';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { LineService } from '@app/tools/services/tools/line.service';
import { LineToolConfigurationComponent } from './line-tool-configuration.component';

describe('LineToolConfigurationComponent', () => {
    // tslint:disable: no-any
    @Component({
        selector: 'mat-icon',
        template: '<span></span>',
    })
    class MockMatIconComponent {
        @Input() svgIcon: any;
        @Input() fontSet: any;
        @Input() fontIcon: any;
    }

    // tslint:disable-next-line: no-magic-numbers
    const SAMPLE_DIAMETERS = [5, 1, 52, 42];
    const LINE_TYPES = [LineType.WITH_JOINTS, LineType.WITHOUT_JOINTS];

    let component: LineToolConfigurationComponent;
    let fixture: ComponentFixture<LineToolConfigurationComponent>;
    let lineServiceStub: jasmine.SpyObj<LineService>;

    beforeEach(async(() => {
        lineServiceStub = jasmine.createSpyObj('LineService', ['setLineType', 'setJointsDiameter']);

        TestBed.configureTestingModule({
            imports: [MaterialModule, BrowserAnimationsModule, CommonModule, MatTooltipModule],
            declarations: [LineToolConfigurationComponent, ResizableToolConfigurationComponent],
            providers: [{ provide: LineService, useValue: lineServiceStub }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .overrideModule(MatIconModule, {
                remove: {
                    declarations: [MatIcon],
                    exports: [MatIcon],
                },
                add: {
                    declarations: [MockMatIconComponent],
                    exports: [MockMatIconComponent],
                },
            })
            .compileComponents();
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
